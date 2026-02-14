/**
 * EXEMPLE DE UTILIZARE - ConfirmDialog & useConfirm
 *
 * Component: Dialog reusable pentru confirmări cu 3 variante (danger/warning/info)
 * Hook: useConfirm pentru utilizare bazată pe promisiuni
 */

'use client'

import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { useConfirm } from '@/hooks/useConfirm'

// ============================================
// EXEMPLU 1: Utilizare directă cu state
// ============================================
export function Example1Direct() {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    console.log('Șters!')
    setIsOpen(false)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Șterge
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
        title="Șterge înregistrarea?"
        message="Această acțiune nu poate fi anulată."
        confirmLabel="Șterge"
        cancelLabel="Anulează"
        variant="danger"
      />
    </>
  )
}

// ============================================
// EXEMPLU 2: Utilizare cu hook useConfirm (RECOMANDAT)
// ============================================
export function Example2Hook() {
  const { confirm, confirmDialog } = useConfirm()

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Șterge înregistrarea?',
      message: 'Această acțiune nu poate fi anulată. Toate datele asociate vor fi pierdute.',
      confirmLabel: 'Șterge definitiv',
      cancelLabel: 'Anulează',
      variant: 'danger',
    })

    if (result) {
      // User clicked "Confirmă"
      console.log('User a confirmat ștergerea')
      // Execută API call, etc.
    } else {
      // User clicked "Anulează" sau ESC
      console.log('User a anulat')
    }
  }

  return (
    <>
      <button onClick={handleDelete}>
        Șterge angajat
      </button>

      <ConfirmDialog {...confirmDialog} />
    </>
  )
}

// ============================================
// EXEMPLU 3: Variantă WARNING
// ============================================
export function Example3Warning() {
  const { confirm, confirmDialog } = useConfirm()

  const handleArchive = async () => {
    const result = await confirm({
      title: 'Arhivează documentul?',
      message: 'Documentul va fi mutat în arhivă și nu va mai fi vizibil în lista activă.',
      confirmLabel: 'Arhivează',
      cancelLabel: 'Renunță',
      variant: 'warning',
    })

    if (result) {
      console.log('Arhivat')
    }
  }

  return (
    <>
      <button onClick={handleArchive}>Arhivează</button>
      <ConfirmDialog {...confirmDialog} />
    </>
  )
}

// ============================================
// EXEMPLU 4: Variantă INFO
// ============================================
export function Example4Info() {
  const { confirm, confirmDialog } = useConfirm()

  const handleExport = async () => {
    const result = await confirm({
      title: 'Exportă raportul?',
      message: 'Va fi generat un fișier PDF cu toate înregistrările selectate.',
      confirmLabel: 'Exportă',
      cancelLabel: 'Anulează',
      variant: 'info',
    })

    if (result) {
      console.log('Exportat')
    }
  }

  return (
    <>
      <button onClick={handleExport}>Exportă PDF</button>
      <ConfirmDialog {...confirmDialog} />
    </>
  )
}

// ============================================
// EXEMPLU 5: Multiple confirmări în același component
// ============================================
export function Example5Multiple() {
  const { confirm, confirmDialog } = useConfirm()

  const handleDeleteEmployee = async () => {
    const result = await confirm({
      title: 'Șterge angajatul?',
      message: 'Angajatul va fi eliminat permanent din sistem.',
      variant: 'danger',
    })

    if (result) {
      // Confirmă din nou dacă are training-uri active
      const finalConfirm = await confirm({
        title: 'Angajatul are training-uri active',
        message: 'Ești sigur că vrei să ștergi angajatul? Training-urile active vor fi anulate.',
        confirmLabel: 'Da, șterge',
        variant: 'danger',
      })

      if (finalConfirm) {
        console.log('Șters definitiv')
      }
    }
  }

  return (
    <>
      <button onClick={handleDeleteEmployee}>Șterge angajat</button>
      <ConfirmDialog {...confirmDialog} />
    </>
  )
}
