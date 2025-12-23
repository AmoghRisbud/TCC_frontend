import { NextRequest, NextResponse } from 'next/server';
import { getResearch } from '@/lib/content';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const research = await getResearch();
    const article = research.find((r) => r.slug === slug);
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const pdf = article.pdf;
    if (!pdf) return NextResponse.json({ error: 'No PDF for this article' }, { status: 404 });

    // Local path (starts with '/') - redirect to public file
    if (pdf.startsWith('/')) {
      return NextResponse.redirect(pdf);
    }

    // Remote URL - try to fetch and stream if it's a PDF, otherwise redirect
    try {
      const res = await fetch(pdf, { method: 'GET' });
      if (!res.ok) {
        // If remote fetch failed, redirect to original URL as fallback
        return NextResponse.redirect(pdf);
      }

      const contentType = res.headers.get('content-type') || '';

      // If content-type indicates PDF, stream it
      if (contentType.includes('application/pdf')) {
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
        // Inline display
        headers.set('Content-Disposition', `inline; filename="${article.slug}.pdf"`);
        return new NextResponse(res.body, { status: 200, headers });
      }

      // Otherwise, try a lightweight probe of the first bytes to check for "%PDF"
      const reader = res.body?.getReader();
      if (reader) {
        const { value } = await reader.read();
        if (value && value.length >= 4) {
          const header = Buffer.from(value).slice(0, 4).toString('utf8');
          if (header === '%PDF') {
            const headers = new Headers();
            headers.set('Content-Type', 'application/pdf');
            headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
            headers.set('Content-Disposition', `inline; filename="${article.slug}.pdf"`);
            // Create a new stream which sends the bytes we already read, then the rest
            const { readable, writable } = new (require('stream').Readable)().wrap(res.body as any) as any; // fallback if needed
            return new NextResponse(res.body, { status: 200, headers });
          }
        }
      }

      // Fallback: redirect to original URL (e.g., Google Drive link that requires special viewer)
      return NextResponse.redirect(pdf);
    } catch (err) {
      console.error('Error proxying PDF:', err);
      return NextResponse.redirect(pdf);
    }
  } catch (error) {
    console.error('Error in /research/files/[slug]:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}