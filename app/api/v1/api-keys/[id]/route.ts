// app/api/v1/api-keys/[id]/route.ts
// API endpoint for revoking API keys

import { NextRequest, NextResponse } from 'next/server'
import { revokeApiKey } from '@/lib/services/api-key-service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { revokedBy } = body

    await revokeApiKey({ keyId: id, revokedBy })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error revoking API key:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}
