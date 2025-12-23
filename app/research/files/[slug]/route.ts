import { NextRequest, NextResponse } from 'next/server';
import { getResearch } from '@/lib/content';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const research = await getResearch();
    let article = research.find((r) => r.slug === slug);

    // If not found in Redis, fall back to reading the markdown file directly so
    // existing markdown-only articles continue to work even if Redis has been cleared.
    if (!article) {
      try {
        const mdPath = path.join(process.cwd(), 'content', 'research', `${slug}.md`);
        if (fs.existsSync(mdPath)) {
          const raw = fs.readFileSync(mdPath, 'utf8');
          const parsed = matter(raw);
          const data = parsed.data as any;
          if (data && data.pdf) {
            article = { slug, pdf: data.pdf } as any;
          }
        }
      } catch (e) {
        console.error('Error reading markdown fallback for research article:', e);
      }
    }

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const pdf = (article as any).pdf;
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

      // If content-type indicates PDF, stream it directly
      if (contentType.toLowerCase().includes('pdf')) {
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
        headers.set('Content-Disposition', `inline; filename="${slug}.pdf"`);
        return new NextResponse(res.body, { status: 200, headers });
      }

      // Otherwise, probe the first bytes to check for PDF magic number '%PDF'
      const reader = res.body?.getReader();
      if (!reader) {
        return NextResponse.redirect(pdf);
      }

      const first = await reader.read();
      const firstChunk = first.value;
      if (!firstChunk || firstChunk.length < 4) {
        return NextResponse.redirect(pdf);
      }

      const header = Buffer.from(firstChunk.slice(0, 4)).toString('utf8');
      if (header !== '%PDF') {
        return NextResponse.redirect(pdf);
      }

      // It's a PDF — create a ReadableStream that first enqueues the chunk we already read,
      // then continues streaming the remaining bytes from the original reader.
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(firstChunk);
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) controller.enqueue(value);
            }
          } catch (err) {
            console.error('Error while streaming remote PDF:', err);
          } finally {
            controller.close();
          }
        },
        cancel(reason) {
          try { reader.cancel?.(); } catch (e) { /* noop */ }
        }
      });

      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
      headers.set('Content-Disposition', `inline; filename="${slug}.pdf"`);

      return new NextResponse(stream, { status: 200, headers });
    } catch (err) {
      console.error('Error proxying PDF:', err);
      return NextResponse.redirect(pdf);
    }
  } catch (error) {
    console.error('Error in /research/files/[slug]:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}