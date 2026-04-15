import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const count = Math.min(parseInt(searchParams.get('count') ?? '5', 10), 10);

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ error: 'UNSPLASH_ACCESS_KEY is not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `Unsplash returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json() as { results: { urls: { regular: string } }[] };
    const urls = data.results.map((r) => r.urls.regular);

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Unsplash' }, { status: 502 });
  }
}
