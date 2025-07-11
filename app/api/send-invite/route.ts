// app/api/send-invite/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check if email service is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' },
        { status: 503 }
      )
    }

    // Dynamically import to avoid build-time errors
    const { sendTeamInvitationEmail } = await import('@/lib/email/resend')
    
    const body = await request.json()
    const { to, propertyName, inviterName, inviterEmail, role, token } = body

    // Validate required fields
    if (!to || !propertyName || !inviterName || !inviterEmail || !role || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendTeamInvitationEmail(to, {
      propertyName,
      inviterName,
      inviterEmail,
      role,
      token
    })

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in send-invite API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
