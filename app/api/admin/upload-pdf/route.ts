import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const fileName = `${timestamp}-${originalName}`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'research');
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, new Uint8Array(buffer));
    
    // Return the public URL
    const publicUrl = `/research/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'PDF uploaded successfully'
    });
    
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ 
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
