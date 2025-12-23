import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Only allow checking cloudinary or same-origin URLs for safety
    const allowedHosts = ['res.cloudinary.com', new URL(process.env.NEXTAUTH_URL || (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')).host];
    try {
      const parsed = new URL(url);
      // Check if the parsed host matches or ends with any allowed host (for subdomains)
      const isAllowed = allowedHosts.some(h => 
        parsed.host === h || parsed.host.endsWith('.' + h)
      );
      if (!isAllowed) {
        return NextResponse.json({ error: `Host not allowed for check: ${parsed.host}` }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    // Perform a fetch and read a small portion to verify PDF signature
    const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/pdf' } });
    const contentType = res.headers.get('content-type') || null;
    const contentLength = res.headers.get('content-length') || null;
    const ok = res.ok;

    if (!ok) {
      return NextResponse.json({ 
        ok: false, 
        contentType, 
        contentLength, 
        startsWithPdf: false,
        error: `HTTP ${res.status}: ${res.statusText}`
      });
    }

    // Read first 8 bytes to check PDF magic number
    const reader = res.body?.getReader();
    let startsWithPdf = false;
    if (reader) {
      try {
        const { value, done } = await reader.read();
        if (value && value.length >= 4) {
          const header = Buffer.from(value).slice(0, 4).toString('utf8');
          startsWithPdf = header === '%PDF';
        }
        // Close reader
        if (!done) {
          try { await reader.cancel(); } catch (e) { /* noop */ }
        }
      } catch (readError) {
        console.error('Error reading PDF bytes:', readError);
      }
    }

    return NextResponse.json({ ok, contentType, contentLength, startsWithPdf });
  } catch (error) {
    console.error('PDF info check failed:', error);
    return NextResponse.json({ error: 'Failed to check PDF' }, { status: 500 });
  }
}
