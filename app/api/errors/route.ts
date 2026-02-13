import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    // Get current user (optional - errors can be logged even for unauthenticated users)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Parse error data from request
    const errorData = await request.json();

    // Log error to Supabase (if you have an errors table)
    // For now, we'll just log to console in production
    console.error('[API Error Log]', {
      userId: user?.id || 'anonymous',
      timestamp: errorData.timestamp || new Date().toISOString(),
      message: errorData.message,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      userAgent: errorData.userAgent,
      url: errorData.url,
    });

    // Optional: Insert into database if you have an error_logs table
    // Uncomment this if you create the table:
    /*
    await supabase.from('error_logs').insert({
      user_id: user?.id,
      message: errorData.message,
      stack: errorData.stack,
      component_stack: errorData.componentStack,
      user_agent: errorData.userAgent,
      url: errorData.url,
      created_at: errorData.timestamp,
    });
    */

    return NextResponse.json(
      { success: true, message: 'Error logged successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to log error:', error);

    // Return success anyway to avoid cascading errors
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 200 }
    );
  }
}
