import { NextResponse } from 'next/server';
import { fetchAllAssets } from '@/lib/fetchAssets';

// ISR: revalidate every 2 days (172800 seconds)
export const revalidate = 172800;

export async function GET() {
  try {
    const data = await fetchAllAssets();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=172800, stale-while-revalidate=86400' },
    });
  } catch (error: any) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
