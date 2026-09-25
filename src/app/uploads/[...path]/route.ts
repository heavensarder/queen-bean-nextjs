import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePathArray = resolvedParams.path;
    
    if (!filePathArray || filePathArray.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Prevent directory traversal attacks
    const safePath = path.normalize(filePathArray.join('/')).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', safePath);

    const fileBuffer = await fs.readFile(absolutePath);
    
    // Determine mime type
    const ext = path.extname(absolutePath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.avif') mimeType = 'image/avif';
    else if (ext === '.svg') mimeType = 'image/svg+xml';
    else if (ext === '.gif') mimeType = 'image/gif';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
