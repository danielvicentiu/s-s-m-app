import { Resend } from 'resend'
import { render } from '@react-email/components'
import WelcomeEmail from '@/emails/WelcomeEmail'
import ExpiryAlertEmail from '@/emails/ExpiryAlertEmail'
import MonthlyReportEmail from '@/emails/MonthlyReportEmail'
import InviteEmail from '@/emails/InviteEmail'
import PasswordResetEmail from '@/emails/PasswordResetEmail'

// Interfaces
interface User {
  id: string
  email: string
  full_name: string
}

interface Alert {
  id: string
  organization_id: string
  organization_name?: string
  alert_type: 'medical' | 'equipment' | 'training'
  item_name: string
  expiry_date: string
  days_until_expiry: number
  recipient_email: string
}

interface Organization {
  id: string
  name: string
}

interface MonthlyReportData {
  organization_id: string
  organization_name: string
  report_month: string
  report_year: number
  stats: {
    totalEmployees: number
    validMedicals: number
    expiringMedicals: number
    expiredMedicals: number
    totalEquipment: number
    compliantEquipment: number
    nonCompliantEquipment: number
    totalAlerts: number
    actionedAlerts: number
  }
  recipient_email: string
  report_url?: string
}

interface EmailQueueItem {
  id: string
  type: 'welcome' | 'expiry_alert' | 'monthly_report' | 'invite' | 'password_reset'
  to: string
  subject: string
  html: string
  retryCount: number
  maxRetries: number
  scheduledAt: Date
  error?: string
}

// Email Service Class
class EmailService {
  private resend: Resend
  private queue: EmailQueueItem[] = []
  private isProcessing = false
  private readonly defaultFrom = 'S-S-M.RO <noreply@s-s-m.ro>'
  private readonly maxRetries = 3
  private readonly retryDelayMs = 5000 // 5 seconds

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    this.resend = new Resend(apiKey)
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcome(user: User, organizationName?: string): Promise<void> {
    try {
      const html = await render(
        WelcomeEmail({
          userFullName: user.full_name,
          organizationName,
          loginUrl: 'https://app.s-s-m.ro',
        })
      )

      const queueItem: EmailQueueItem = {
        id: `welcome-${user.id}-${Date.now()}`,
        type: 'welcome',
        to: user.email,
        subject: 'Bine ai venit pe S-S-M.RO!',
        html,
        retryCount: 0,
        maxRetries: this.maxRetries,
        scheduledAt: new Date(),
      }

      await this.addToQueue(queueItem)

      console.log(`[EmailService] Welcome email queued for ${user.email}`)
    } catch (error) {
      console.error('[EmailService] Error queueing welcome email:', error)
      throw error
    }
  }

  /**
   * Send expiry alert email
   */
  async sendExpiryAlert(alert: Alert): Promise<void> {
    try {
      const html = await render(
        ExpiryAlertEmail({
          organizationName: alert.organization_name || 'Organizația ta',
          alertType: alert.alert_type,
          itemName: alert.item_name,
          expiryDate: alert.expiry_date,
          daysUntilExpiry: alert.days_until_expiry,
          dashboardUrl: 'https://app.s-s-m.ro/dashboard',
        })
      )

      const severity =
        alert.days_until_expiry <= 0
          ? 'EXPIRAT'
          : alert.days_until_expiry <= 7
          ? 'URGENT'
          : 'ATENȚIE'

      const queueItem: EmailQueueItem = {
        id: `alert-${alert.id}-${Date.now()}`,
        type: 'expiry_alert',
        to: alert.recipient_email,
        subject: `[${severity}] Alertă expirare: ${alert.item_name}`,
        html,
        retryCount: 0,
        maxRetries: this.maxRetries,
        scheduledAt: new Date(),
      }

      await this.addToQueue(queueItem)

      console.log(`[EmailService] Expiry alert queued for ${alert.recipient_email}`)
    } catch (error) {
      console.error('[EmailService] Error queueing expiry alert:', error)
      throw error
    }
  }

  /**
   * Send monthly report email
   */
  async sendMonthlyReport(reportData: MonthlyReportData): Promise<void> {
    try {
      const html = await render(
        MonthlyReportEmail({
          organizationName: reportData.organization_name,
          reportMonth: reportData.report_month,
          reportYear: reportData.report_year,
          stats: reportData.stats,
          dashboardUrl: 'https://app.s-s-m.ro/dashboard',
          reportUrl: reportData.report_url,
        })
      )

      const queueItem: EmailQueueItem = {
        id: `report-${reportData.organization_id}-${Date.now()}`,
        type: 'monthly_report',
        to: reportData.recipient_email,
        subject: `Raport lunar ${reportData.report_month} ${reportData.report_year} - ${reportData.organization_name}`,
        html,
        retryCount: 0,
        maxRetries: this.maxRetries,
        scheduledAt: new Date(),
      }

      await this.addToQueue(queueItem)

      console.log(`[EmailService] Monthly report queued for ${reportData.recipient_email}`)
    } catch (error) {
      console.error('[EmailService] Error queueing monthly report:', error)
      throw error
    }
  }

  /**
   * Send organization invite email
   */
  async sendInvite(
    email: string,
    organization: Organization,
    inviterName: string,
    role: string,
    inviteUrl: string,
    expiresInDays: number = 7
  ): Promise<void> {
    try {
      const html = await render(
        InviteEmail({
          inviterName,
          organizationName: organization.name,
          role,
          inviteUrl,
          expiresInDays,
        })
      )

      const queueItem: EmailQueueItem = {
        id: `invite-${organization.id}-${email}-${Date.now()}`,
        type: 'invite',
        to: email,
        subject: `Invitație la ${organization.name} pe S-S-M.RO`,
        html,
        retryCount: 0,
        maxRetries: this.maxRetries,
        scheduledAt: new Date(),
      }

      await this.addToQueue(queueItem)

      console.log(`[EmailService] Invite email queued for ${email}`)
    } catch (error) {
      console.error('[EmailService] Error queueing invite email:', error)
      throw error
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    email: string,
    resetLink: string,
    expiresInMinutes: number = 60
  ): Promise<void> {
    try {
      const html = await render(
        PasswordResetEmail({
          email,
          resetUrl: resetLink,
          expiresInMinutes,
        })
      )

      const queueItem: EmailQueueItem = {
        id: `reset-${email}-${Date.now()}`,
        type: 'password_reset',
        to: email,
        subject: 'Resetare parolă S-S-M.RO',
        html,
        retryCount: 0,
        maxRetries: this.maxRetries,
        scheduledAt: new Date(),
      }

      await this.addToQueue(queueItem)

      console.log(`[EmailService] Password reset email queued for ${email}`)
    } catch (error) {
      console.error('[EmailService] Error queueing password reset email:', error)
      throw error
    }
  }

  /**
   * Add email to queue and start processing
   */
  private async addToQueue(item: EmailQueueItem): Promise<void> {
    this.queue.push(item)

    // Start processing if not already running
    if (!this.isProcessing) {
      void this.processQueue()
    }
  }

  /**
   * Process email queue with retry logic
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0) {
      const item = this.queue[0]

      try {
        // Check if scheduled time has arrived
        if (item.scheduledAt > new Date()) {
          const delay = item.scheduledAt.getTime() - Date.now()
          await this.sleep(delay)
        }

        // Attempt to send email
        const { data, error } = await this.resend.emails.send({
          from: this.defaultFrom,
          to: item.to,
          subject: item.subject,
          html: item.html,
        })

        if (error) {
          throw new Error(error.message || 'Unknown Resend error')
        }

        console.log(
          `[EmailService] Email sent successfully: ${item.type} to ${item.to} (ID: ${data?.id})`
        )

        // Remove from queue on success
        this.queue.shift()
      } catch (error) {
        item.retryCount++
        item.error = error instanceof Error ? error.message : 'Unknown error'

        console.error(
          `[EmailService] Error sending email (attempt ${item.retryCount}/${item.maxRetries}):`,
          error
        )

        if (item.retryCount >= item.maxRetries) {
          // Max retries reached, remove from queue and log
          console.error(
            `[EmailService] Max retries reached for email: ${item.type} to ${item.to}. Removing from queue.`
          )
          this.queue.shift()

          // In production, you might want to log this to a failed emails table
          await this.logFailedEmail(item)
        } else {
          // Schedule retry with exponential backoff
          const backoffDelay = this.retryDelayMs * Math.pow(2, item.retryCount - 1)
          item.scheduledAt = new Date(Date.now() + backoffDelay)

          console.log(
            `[EmailService] Scheduling retry in ${backoffDelay}ms for email: ${item.type} to ${item.to}`
          )

          // Move to end of queue to process other emails first
          this.queue.shift()
          this.queue.push(item)
        }
      }

      // Small delay between emails to avoid rate limits
      await this.sleep(100)
    }

    this.isProcessing = false
  }

  /**
   * Log failed email for debugging/monitoring
   */
  private async logFailedEmail(item: EmailQueueItem): Promise<void> {
    // In production, you would log this to Supabase or another logging service
    console.error('[EmailService] FAILED EMAIL:', {
      id: item.id,
      type: item.type,
      to: item.to,
      subject: item.subject,
      retryCount: item.retryCount,
      error: item.error,
      timestamp: new Date().toISOString(),
    })

    // TODO: Log to Supabase table 'email_failures' if needed
    // await supabase.from('email_failures').insert({
    //   email_id: item.id,
    //   email_type: item.type,
    //   recipient: item.to,
    //   subject: item.subject,
    //   error_message: item.error,
    //   retry_count: item.retryCount,
    //   failed_at: new Date().toISOString(),
    // })
  }

  /**
   * Helper: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get queue status (useful for monitoring)
   */
  getQueueStatus(): {
    queueLength: number
    isProcessing: boolean
    items: Array<{ id: string; type: string; to: string; retryCount: number }>
  } {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      items: this.queue.map((item) => ({
        id: item.id,
        type: item.type,
        to: item.to,
        retryCount: item.retryCount,
      })),
    }
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService()
  }
  return emailServiceInstance
}

// Export the service
export const emailService = getEmailService()

// Export types
export type {
  User,
  Alert,
  Organization,
  MonthlyReportData,
  EmailQueueItem,
}
