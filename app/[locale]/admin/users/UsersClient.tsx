'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Shield, Lock, Unlock, Trash2, Edit, Building2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface UserWithAuth {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  email: string
  is_super_admin: boolean
  is_blocked: boolean
  created_at: string
  last_sign_in_at: string | null
  memberships: Array<{
    role: string
    is_active: boolean
    organization: {
      id: string
      name: string
    }
  }>
}

interface UsersClientProps {
  users: UserWithAuth[]
}

export default function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    isDestructive: boolean
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDestructive: false,
    onConfirm: () => {},
  })

  const supabase = createSupabaseBrowser()

  const handleBlockUser = async (userId: string, currentlyBlocked: boolean) => {
    setConfirmDialog({
      isOpen: true,
      title: currentlyBlocked ? 'Deblochează utilizator' : 'Blochează utilizator',
      message: currentlyBlocked
        ? 'Ești sigur că vrei să deblochezi acest utilizator?'
        : 'Ești sigur că vrei să blochezi acest utilizator? Nu va mai putea accesa platforma.',
      isDestructive: !currentlyBlocked,
      onConfirm: async () => {
        setLoading(true)
        const { error } = await supabase
          .from('profiles')
          .update({ is_blocked: !currentlyBlocked })
          .eq('id', userId)

        if (error) {
          alert(`Eroare: ${error.message}`)
        } else {
          setUsers(users.map(u =>
            u.id === userId ? { ...u, is_blocked: !currentlyBlocked } : u
          ))
        }
        setLoading(false)
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      }
    })
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Șterge utilizator',
      message: `Ești sigur că vrei să ștergi utilizatorul "${userName}"? Această acțiune este IREVERSIBILĂ și va șterge toate datele asociate.`,
      isDestructive: true,
      onConfirm: async () => {
        setLoading(true)

        // NOTE: Ștergerea utilizatorilor trebuie făcută prin auth.admin.deleteUser
        const { error } = await supabase.auth.admin.deleteUser(userId)

        if (error) {
          alert(`Eroare: ${error.message}`)
        } else {
          setUsers(users.filter(u => u.id !== userId))
        }
        setLoading(false)
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      }
    })
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Astăzi'
    if (diffDays === 1) return 'Ieri'
    if (diffDays < 7) return `Acum ${diffDays} zile`
    if (diffDays < 30) return `Acum ${Math.floor(diffDays / 7)} săptămâni`
    if (diffDays < 365) return `Acum ${Math.floor(diffDays / 30)} luni`

    return date.toLocaleDateString('ro-RO')
  }

  const getStatusBadge = (user: UserWithAuth) => {
    if (user.is_blocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Blocat
        </span>
      )
    }

    const hasActiveMembership = user.memberships.some(m => m.is_active)
    if (!hasActiveMembership) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Inactiv
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Activ
      </span>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleLabels: Record<string, { label: string; color: string }> = {
      consultant: { label: 'Consultant SSM', color: 'bg-blue-100 text-blue-700' },
      firma_admin: { label: 'Admin Firmă', color: 'bg-purple-100 text-purple-700' },
      angajat: { label: 'Angajat', color: 'bg-gray-100 text-gray-700' },
    }

    const config = roleLabels[role] || { label: role, color: 'bg-gray-100 text-gray-700' }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const columns: Column<UserWithAuth>[] = [
    {
      key: 'full_name',
      label: 'Nume',
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 text-sm font-medium">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium flex items-center gap-2">
              {user.full_name}
              {user.is_super_admin && (
                <span title="Super Admin">
                  <Shield className="h-4 w-4 text-amber-500" />
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{user.phone || '—'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'organization',
      label: 'Organizație',
      render: (user) => {
        const activeMembership = user.memberships.find(m => m.is_active)
        if (!activeMembership) {
          return <span className="text-gray-400">—</span>
        }
        return (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span>{activeMembership.organization.name}</span>
          </div>
        )
      },
    },
    {
      key: 'role',
      label: 'Rol',
      render: (user) => {
        const activeMembership = user.memberships.find(m => m.is_active)
        if (!activeMembership) {
          return <span className="text-gray-400">—</span>
        }
        return getRoleBadge(activeMembership.role)
      },
    },
    {
      key: 'last_sign_in_at',
      label: 'Ultima autentificare',
      render: (user) => (
        <span className="text-sm">{formatDate(user.last_sign_in_at)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => getStatusBadge(user),
      sortable: false,
    },
    {
      key: 'actions',
      label: 'Acțiuni',
      sortable: false,
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Funcționalitate în dezvoltare')}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
            title="Editează rol"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleBlockUser(user.id, user.is_blocked)}
            className={`p-1.5 rounded-lg ${
              user.is_blocked
                ? 'hover:bg-green-50 text-green-600'
                : 'hover:bg-orange-50 text-orange-600'
            }`}
            title={user.is_blocked ? 'Deblochează' : 'Blochează'}
            disabled={loading}
          >
            {user.is_blocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleDeleteUser(user.id, user.full_name)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
            title="Șterge utilizator"
            disabled={loading || user.is_super_admin}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Administrare Utilizatori</h1>
        <p className="text-gray-600">
          Gestionează utilizatorii platformei, rolurile și accesul acestora.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Nu există utilizatori în sistem"
          pageSize={25}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        loading={loading}
      />
    </div>
  )
}
