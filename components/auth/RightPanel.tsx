'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TabLogin } from './TabLogin'
import { TabRegister } from './TabRegister'
import { TabQuickAccess } from './TabQuickAccess'

type TabId = 'login' | 'register' | 'quick'

export function RightPanel() {
  const [active, setActive] = useState<TabId>('login')
  const t = useTranslations('auth.tabs')

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'login', label: t('login') },
    { id: 'register', label: t('register') },
    { id: 'quick', label: t('quick') },
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-[40%] lg:px-12 xl:px-16">
      <div className="w-full max-w-sm">
        {/* Tab bar */}
        <div className="mb-8 flex rounded-lg bg-secondary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 rounded-md px-2 py-2 text-center text-sm font-medium transition-all ${
                active === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={active}>
          {active === 'login' && <TabLogin />}
          {active === 'register' && <TabRegister />}
          {active === 'quick' && <TabQuickAccess />}
        </div>
      </div>
    </div>
  )
}
