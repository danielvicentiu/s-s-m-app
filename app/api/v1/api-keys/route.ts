// app/api/v1/api-keys/route.ts
// API endpoint for creating API keys

import { NextRequest, NextResponse } from 'next/server'
import { createApiKey } from '@/lib/services/api-key-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, name, description, permissions, createdBy } = body

    if (!organizationId || !name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createApiKey({
      organizationId,
      name,
      description,
      permissions,
      createdBy,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create API key' },
      { status: 500 }
    )
  }
}
