// app/api/v1/api-keys/[id]/rotate/route.ts
// API endpoint for rotating API keys

import { NextRequest, NextResponse } from 'next/server'
import { rotateApiKey } from '@/lib/services/api-key-service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { rotatedBy } = body

    const result = await rotateApiKey({ keyId: id, rotatedBy })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error rotating API key:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to rotate API key' },
      { status: 500 }
    )
  }
}
