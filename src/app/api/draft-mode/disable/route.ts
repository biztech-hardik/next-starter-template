import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function GET() {
  (await draftMode()).disable();
  return NextResponse.json({ success: true });
}