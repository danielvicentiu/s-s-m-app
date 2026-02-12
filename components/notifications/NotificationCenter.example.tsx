/**
 * NotificationCenter - Component Usage Examples
 *
 * Componenta NotificationCenter oferă un sistem complet de notificări in-app
 * cu dropdown overlay, filtrare pe tipuri, badge count și mark as read.
 */

'use client'

import { useState } from 'react'
import { NotificationCenter, type Notification, type NotificationType } from './NotificationCenter'

// ============================================================================
// EXAMPLE 1: Basic Usage
// ============================================================================

export function BasicExample() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Certificat medical expirat',
      message: 'Certificatul medical al lui Ion Popescu a expirat pe 10.02.2026',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore în urmă
    },
    {
      id: '2',
      type: 'warning',
      title: 'Instruire aproape de expirare',
      message: 'Instruirea PSI pentru 5 angajați expiră în 7 zile',
      read: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 oră în urmă
    },
    {
      id: '3',
      type: 'info',
      title: 'Raport lunar generat',
      message: 'Raportul lunar pentru ianuarie 2026 a fost generat cu succes',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // ieri
    },
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  return (
    <div className="flex justify-end p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: With Clear/Delete Functionality
// ============================================================================

export function WithClearExample() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Angajat adăugat',
      message: 'Maria Ionescu a fost adăugată cu succes în sistem',
      read: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'alert',
      title: 'Echipament defect',
      message: 'Stingătorul S-001 necesită verificare urgentă',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="flex justify-end p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearNotification={handleClearNotification}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Empty State
// ============================================================================

export function EmptyStateExample() {
  return (
    <div className="flex justify-end p-4">
      <NotificationCenter
        notifications={[]}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Integration with Supabase Real-time
// ============================================================================

export function RealtimeExample() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Simulare fetch din Supabase
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     const supabase = createSupabaseBrowser()
  //     const { data } = await supabase
  //       .from('notifications')
  //       .select('*')
  //       .order('created_at', { ascending: false })
  //
  //     if (data) {
  //       setNotifications(data.map(n => ({
  //         id: n.id,
  //         type: n.type as NotificationType,
  //         title: n.title,
  //         message: n.message,
  //         read: n.read,
  //         createdAt: new Date(n.created_at),
  //       })))
  //     }
  //   }
  //
  //   fetchNotifications()
  //
  //   // Supabase real-time subscription
  //   const channel = supabase
  //     .channel('notifications')
  //     .on('postgres_changes',
  //       { event: 'INSERT', schema: 'public', table: 'notifications' },
  //       (payload) => {
  //         const newNotification = payload.new as any
  //         setNotifications(prev => [{
  //           id: newNotification.id,
  //           type: newNotification.type,
  //           title: newNotification.title,
  //           message: newNotification.message,
  //           read: false,
  //           createdAt: new Date(newNotification.created_at),
  //         }, ...prev])
  //       }
  //     )
  //     .subscribe()
  //
  //   return () => {
  //     supabase.removeChannel(channel)
  //   }
  // }, [])

  const handleMarkAsRead = async (id: string) => {
    // const supabase = createSupabaseBrowser()
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', id)

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = async () => {
    // const supabase = createSupabaseBrowser()
    // const userId = (await supabase.auth.getUser()).data.user?.id
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('user_id', userId)
    //   .eq('read', false)

    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const handleClearNotification = async (id: string) => {
    // const supabase = createSupabaseBrowser()
    // await supabase
    //   .from('notifications')
    //   .delete()
    //   .eq('id', id)

    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="flex justify-end p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearNotification={handleClearNotification}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: All Notification Types
// ============================================================================

export function AllTypesExample() {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Certificat expirat',
      message: 'Certificatul medical al lui Ion Popescu a expirat',
      read: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'warning',
      title: 'Instruire aproape de expirare',
      message: 'Instruirea PSI pentru 5 angajați expiră în 7 zile',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'info',
      title: 'Raport lunar generat',
      message: 'Raportul lunar pentru ianuarie 2026 a fost generat cu succes',
      read: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'success',
      title: 'Angajat adăugat',
      message: 'Maria Ionescu a fost adăugată cu succes în sistem',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ])

  return (
    <div className="flex justify-end p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
        onClearNotification={() => {}}
      />
    </div>
  )
}

// ============================================================================
// Supabase Schema Suggestion
// ============================================================================

/**
 * CREATE TABLE notifications (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
 *   type TEXT NOT NULL CHECK (type IN ('alert', 'info', 'success', 'warning')),
 *   title TEXT NOT NULL,
 *   message TEXT NOT NULL,
 *   read BOOLEAN DEFAULT FALSE,
 *   metadata JSONB DEFAULT '{}'::jsonb,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
 * CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
 *
 * -- RLS Policies
 * ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view own notifications"
 *   ON notifications FOR SELECT
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can update own notifications"
 *   ON notifications FOR UPDATE
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can delete own notifications"
 *   ON notifications FOR DELETE
 *   USING (auth.uid() = user_id);
 */
