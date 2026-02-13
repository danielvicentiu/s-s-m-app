'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface Tab {
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  badge?: string | number
}

interface TabsV2Props {
  tabs: Tab[]
  defaultTab?: number
  className?: string
}

export default function TabsV2({ tabs, defaultTab = 0, className = '' }: TabsV2Props) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      })
    }
  }, [activeTab])

  const handleTabClick = (index: number) => {
    setActiveTab(index)
    setIsDropdownOpen(false)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Tab Bar */}
      <div className="hidden md:block border-b border-gray-200">
        <div className="relative">
          <div className="flex space-x-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                onClick={() => handleTabClick(index)}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-colors duration-200
                  flex items-center gap-2
                  ${
                    activeTab === index
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.icon && (
                  <span className="w-4 h-4 flex items-center justify-center">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`
                      px-2 py-0.5 text-xs font-semibold rounded-full
                      ${
                        activeTab === index
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Animated Underline Indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {tabs[activeTab].icon && (
              <span className="w-4 h-4 flex items-center justify-center text-blue-600">
                {tabs[activeTab].icon}
              </span>
            )}
            <span className="text-sm font-medium text-gray-900">
              {tabs[activeTab].label}
            </span>
            {tabs[activeTab].badge !== undefined && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                {tabs[activeTab].badge}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Menu */}
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`
                    w-full flex items-center gap-2 px-4 py-3 text-left transition-colors
                    ${
                      activeTab === index
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.icon && (
                    <span className="w-4 h-4 flex items-center justify-center">
                      {tab.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium flex-1">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`
                        px-2 py-0.5 text-xs font-semibold rounded-full
                        ${
                          activeTab === index
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}
