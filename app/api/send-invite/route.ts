// app/api/send-invite/route.ts
import { NextResponse } from 'next/server'
import { sendTeamInvitationEmail } from '@/lib/email/resend'

export async function POST(request: Request) {
  try {
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
