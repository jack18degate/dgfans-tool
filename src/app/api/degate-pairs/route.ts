import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://v1-mainnet-backend.degate.com/order-book-api/turbo-range/products?limit=100&offset=0',
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DGFans-Tool/1.0',
        },
        next: { revalidate: 900 }, // cache 15 minuti
      }
    );

    if (!res.ok) {
      // fallback: prova il secondo endpoint
      const fallback = await fetch(
        'https://v1-nd-api.degate.com/order-book-api/turbo-range/products?limit=100&offset=0',
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DGFans-Tool/1.0',
          },
        }
      );
      if (!fallback.ok) {
        return NextResponse.json({ error: 'Degate API unreachable' }, { status: 502 });
      }
      const fallbackData = await fallback.json();
      return NextResponse.json(fallbackData);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
