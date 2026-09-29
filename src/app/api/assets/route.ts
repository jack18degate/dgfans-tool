import { NextResponse } from 'next/server';
import { fetchAllAssets } from '@/lib/fetchAssets';

// ISR: revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchAllAssets();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
    });
  } catch (error: any) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
