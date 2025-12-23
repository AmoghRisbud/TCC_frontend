import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Migration endpoint removed' }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ message: 'Migration endpoint removed' }, { status: 410 });
}
