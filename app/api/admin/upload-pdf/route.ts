import { NextRequest, NextResponse } from 'next/server';

// Upload PDFs to Vercel Blob storage and return a same-origin proxy URL
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF files are allowed' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Ensure Vercel API token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json({ error: 'Vercel not configured. Please set BLOB_READ_WRITE_TOKEN in environment.' }, { status: 500 });
    }

    // Step 1: Request an upload slot from Vercel Blob API
    const createHeaders: Record<string,string> = {
      'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      'Content-Type': 'application/json'
    };
    if (process.env.VERCEL_TEAM_ID) {
      createHeaders['x-vercel-team-id'] = process.env.VERCEL_TEAM_ID;
    }
    if (process.env.VERCEL_ORG_ID) {
      createHeaders['x-vercel-organization-id'] = process.env.VERCEL_ORG_ID;
    }

    const createRes = await fetch('https://api.vercel.com/v1/blob', {
      method: 'POST',
      headers: createHeaders,
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type
      })
    });

    if (!createRes.ok) {
      let bodyText = await createRes.text().catch(() => '');
      let bodyJson: any = null;
      try { bodyJson = JSON.parse(bodyText); } catch (e) { /* not JSON */ }

      console.error('Failed to create Vercel blob:', createRes.status, bodyText || bodyJson);

      // Provide actionable hint for 403 errors
      if (createRes.status === 403) {
        let hint = 'Verify that BLOB_READ_WRITE_TOKEN is a personal token with the correct permissions and belongs to the same account/team as your project.';
        if (!process.env.VERCEL_TEAM_ID && bodyJson && bodyJson.error && bodyJson.error.message && bodyJson.error.message.toLowerCase().includes('store id')) {
          hint += ' If your project is under a Team, set VERCEL_TEAM_ID env var to the team id.';
        }
        return NextResponse.json({ error: 'Failed to create upload slot on Vercel', details: bodyJson || bodyText, hint }, { status: 500 });
      }

      return NextResponse.json({ error: 'Failed to create upload slot on Vercel', details: bodyJson || bodyText }, { status: 500 });
    }

    const createJson = await createRes.json();
    // Expecting { id, uploadUrl, url } or similar
    const { id, uploadUrl, url } = createJson as any;

    if (!id || !uploadUrl) {
      console.error('Unexpected response from Vercel blob creation:', createJson);
      return NextResponse.json({ error: 'Unexpected Vercel response', details: createJson }, { status: 500 });
    }

    // Step 2: Upload the raw bytes to the uploadUrl
    const bytes = await file.arrayBuffer();
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: Buffer.from(bytes)
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error('Failed to PUT file to Vercel upload url:', putRes.status, text);
      return NextResponse.json({ error: 'Failed to upload file to Vercel storage' }, { status: 500 });
    }

    // Return a same-origin proxy path that can be used in the UI and validated safely
    const proxyUrl = `/api/admin/blob/${encodeURIComponent(id)}`;

    return NextResponse.json({ success: true, url: proxyUrl, id, vercelUrl: url || null });

  } catch (error) {
    console.error('Error uploading PDF to Vercel Blob:', error);
    return NextResponse.json({ 
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
