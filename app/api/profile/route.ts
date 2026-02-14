// app/api/profile/route.ts
// Profile API — GET current user profile, PUT to update profile data
// Features: name, phone, locale, avatar_url, notification preferences

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiError } from '@/lib/api/middleware'
import { z } from 'zod'

/**
 * Zod schema for profile update
 */
const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere').max(255).optional(),
  phone: z.string().max(20).nullable().optional(),
  locale: z.enum(['ro', 'en', 'bg', 'hu', 'de']).optional(),
  avatar_url: z.string().url('URL avatar invalid').nullable().optional(),
  notification_preferences: z.object({
    email_notifications: z.boolean().optional(),
    push_notifications: z.boolean().optional(),
    whatsapp_notifications: z.boolean().optional(),
    sms_notifications: z.boolean().optional()
  }).optional()
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile data from JWT
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 full_name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                   nullable: true
 *                 avatar_url:
 *                   type: string
 *                   nullable: true
 *                 locale:
 *                   type: string
 *                   enum: [ro, en, bg, hu, de]
 *                 notification_preferences:
 *                   type: object
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[GET /api/profile] Profile error:', profileError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea profilului',
          details: profileError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    // Get user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('key, value')
      .eq('user_id', user.id)

    if (prefsError) {
      console.error('[GET /api/profile] Preferences error:', prefsError)
    }

    // Parse preferences into a structured object
    const prefsMap: Record<string, any> = {}
    if (preferences) {
      preferences.forEach((pref) => {
        try {
          prefsMap[pref.key] = JSON.parse(pref.value)
        } catch {
          prefsMap[pref.key] = pref.value
        }
      })
    }

    // Build response
    const response = {
      id: profile.id,
      email: user.email,
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      locale: prefsMap.preferred_locale || 'ro',
      notification_preferences: {
        email_notifications: prefsMap.email_notifications !== false,
        push_notifications: prefsMap.push_notifications !== false,
        whatsapp_notifications: prefsMap.whatsapp_notifications !== false,
        sms_notifications: prefsMap.sms_notifications !== false
      },
      created_at: profile.created_at
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/profile]', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}

/**
 * @openapi
 * /api/profile:
 *   put:
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile data
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 nullable: true
 *               locale:
 *                 type: string
 *                 enum: [ro, en, bg, hu, de]
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *               notification_preferences:
 *                 type: object
 *                 properties:
 *                   email_notifications:
 *                     type: boolean
 *                   push_notifications:
 *                     type: boolean
 *                   whatsapp_notifications:
 *                     type: boolean
 *                   sms_notifications:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Validate request body
    const body = await req.json().catch(() => ({}))
    const result = updateProfileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Date de intrare invalide',
          details: result.error.format(),
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      )
    }

    const data: UpdateProfileInput = result.data

    // Update profiles table if profile fields are present
    const profileFields: { full_name?: string; phone?: string | null; avatar_url?: string | null } = {}
    if (data.full_name !== undefined) profileFields.full_name = data.full_name
    if (data.phone !== undefined) profileFields.phone = data.phone
    if (data.avatar_url !== undefined) profileFields.avatar_url = data.avatar_url

    if (Object.keys(profileFields).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileFields)
        .eq('id', user.id)

      if (profileError) {
        console.error('[PUT /api/profile] Profile update error:', profileError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la actualizarea profilului',
            details: profileError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }
    }

    // Update user_preferences if locale or notification_preferences are present
    const preferencesToUpdate: { key: string; value: string }[] = []

    if (data.locale !== undefined) {
      preferencesToUpdate.push({ key: 'preferred_locale', value: JSON.stringify(data.locale) })
    }

    if (data.notification_preferences) {
      if (data.notification_preferences.email_notifications !== undefined) {
        preferencesToUpdate.push({
          key: 'email_notifications',
          value: JSON.stringify(data.notification_preferences.email_notifications)
        })
      }
      if (data.notification_preferences.push_notifications !== undefined) {
        preferencesToUpdate.push({
          key: 'push_notifications',
          value: JSON.stringify(data.notification_preferences.push_notifications)
        })
      }
      if (data.notification_preferences.whatsapp_notifications !== undefined) {
        preferencesToUpdate.push({
          key: 'whatsapp_notifications',
          value: JSON.stringify(data.notification_preferences.whatsapp_notifications)
        })
      }
      if (data.notification_preferences.sms_notifications !== undefined) {
        preferencesToUpdate.push({
          key: 'sms_notifications',
          value: JSON.stringify(data.notification_preferences.sms_notifications)
        })
      }
    }

    // Upsert preferences
    for (const pref of preferencesToUpdate) {
      const { error: prefError } = await supabase.from('user_preferences').upsert(
        {
          user_id: user.id,
          key: pref.key,
          value: pref.value,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,key' }
      )

      if (prefError) {
        console.error('[PUT /api/profile] Preference update error:', prefError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la actualizarea preferințelor',
            details: prefError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }
    }

    // Get updated profile
    const { data: updatedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, created_at')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('[PUT /api/profile] Fetch updated profile error:', fetchError)
    }

    return NextResponse.json({
      message: 'Profil actualizat cu succes',
      profile: updatedProfile || { id: user.id }
    })
  } catch (error) {
    console.error('[PUT /api/profile]', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}
