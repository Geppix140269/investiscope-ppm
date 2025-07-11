// lib/email/resend.ts
import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export const emailTemplates = {
  teamInvitation: (inviteData: {
    propertyName: string
    inviterName: string
    inviterEmail: string
    role: string
    inviteUrl: string
  }) => ({
    subject: `You've been invited to join ${inviteData.propertyName} on InvestiScope PPM`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">InvestiScope PPM</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Property Project Management</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">You're invited to collaborate!</h2>
            
            <p style="font-size: 16px; color: #555;">
              <strong>${inviteData.inviterName}</strong> (${inviteData.inviterEmail}) has invited you to join the team for:
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${inviteData.propertyName}</h3>
              <p style="margin: 0; color: #666;">Role: <strong>${inviteData.role}</strong></p>
            </div>
            
            <p style="font-size: 16px; color: #555;">
              As a ${inviteData.role}, you'll be able to:
            </p>
            
            <ul style="color: #555; font-size: 15px;">
              ${inviteData.role === 'admin' ? `
                <li>View and edit property details</li>
                <li>Manage all projects and tasks</li>
                <li>Upload and manage documents</li>
                <li>Invite other team members</li>
                <li>View financial information</li>
              ` : inviteData.role === 'member' ? `
                <li>View property and project information</li>
                <li>Update task status</li>
                <li>Upload documents</li>
                <li>Add comments and notes</li>
              ` : `
                <li>View property and project information</li>
                <li>View documents</li>
                <li>Track project progress</li>
              `}
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteData.inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: center;">
              This invitation will expire in 7 days. If you're having trouble with the button above, copy and paste this link into your browser:
            </p>
            <p style="font-size: 12px; color: #888; text-align: center; word-break: break-all;">
              ${inviteData.inviteUrl}
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #888; font-size: 14px;">
            <p style="margin: 0;">© 2025 InvestiScope PPM. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Professional Property Project Management for Puglia</p>
          </div>
        </body>
      </html>
    `,
    text: `
      You've been invited to join ${inviteData.propertyName} on InvestiScope PPM
      
      ${inviteData.inviterName} (${inviteData.inviterEmail}) has invited you to join as a ${inviteData.role}.
      
      Accept the invitation: ${inviteData.inviteUrl}
      
      This invitation will expire in 7 days.
    `
  }),

  welcomeEmail: (userData: {
    name: string
    email: string
  }) => ({
    subject: 'Welcome to InvestiScope PPM!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to InvestiScope PPM!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${userData.name}!</h2>
            
            <p style="font-size: 16px; color: #555;">
              Thank you for joining InvestiScope PPM. Your account has been created successfully.
            </p>
            
            <h3 style="color: #333; margin-top: 30px;">Getting Started</h3>
            
            <ol style="color: #555; font-size: 15px;">
              <li><strong>Add Your First Property</strong> - Start by adding a property to your portfolio</li>
              <li><strong>Create a Project</strong> - Plan your renovation or maintenance work</li>
              <li><strong>Invite Your Team</strong> - Collaborate with contractors and property managers</li>
              <li><strong>Track Progress</strong> - Monitor budgets, tasks, and timelines</li>
            </ol>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Need Help?</h4>
              <p style="margin: 0; color: #666;">
                Check out our <a href="https://investiscope.net/help" style="color: #667eea;">help center</a> or reply to this email for support.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://investiscope.net/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to InvestiScope PPM!
      
      Hi ${userData.name}!
      
      Thank you for joining InvestiScope PPM. Your account has been created successfully.
      
      Get started: https://investiscope.net/dashboard
    `
  })
}

// Send email function
export async function sendEmail(to: string, template: { subject: string; html: string; text: string }) {
  try {
    const data = await resend.emails.send({
      from: 'InvestiScope PPM <noreply@investiscope.net>',
      to: [to],
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Send team invitation email
export async function sendTeamInvitationEmail(
  to: string,
  inviteData: {
    propertyName: string
    inviterName: string
    inviterEmail: string
    role: string
    token: string
  }
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/team/accept/${inviteData.token}`
  
  const template = emailTemplates.teamInvitation({
    ...inviteData,
    inviteUrl
  })
  
  return sendEmail(to, template)
}

// Send welcome email
export async function sendWelcomeEmail(userData: { name: string; email: string }) {
  const template = emailTemplates.welcomeEmail(userData)
  return sendEmail(userData.email, template)
}
