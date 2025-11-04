import { NextResponse } from 'next/server'

// Minimal stub: return empty list for now (no mock)
export async function GET() {
  return NextResponse.json({ templates: [] })
}

