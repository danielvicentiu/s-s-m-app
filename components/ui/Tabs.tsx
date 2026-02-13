'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
  icon?: LucideIcon;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  children?: (activeTab: Tab) => React.ReactNode;
  className?: string;
  onChange?: (tabId: string) => void;
}

export default function Tabs({
  tabs,
  defaultTabId,
  children,
  className = '',
  onChange,
}: TabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || tabs[0]?.id || ''
  );
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    if (defaultTabId && defaultTabId !== activeTabId) {
      setActiveTabId(defaultTabId);
    }
  }, [defaultTabId]);

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    const newTab = tabs[newIndex];
    if (newTab) {
      handleTabChange(newTab.id);
      tabRefs.current[newTab.id]?.focus();
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop: Tabs with underline */}
      <div className="hidden sm:block border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8"
          aria-label="Tabs"
          role="tablist"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`
                  group inline-flex items-center gap-2 border-b-2 py-4 px-1
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {Icon && (
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                )}
                {tab.label}
                {typeof tab.count === 'number' && (
                  <span
                    className={`
                      ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile: Dropdown select */}
      <div className="sm:hidden">
        <label htmlFor="tabs-select" className="sr-only">
          Selectează tab
        </label>
        <select
          id="tabs-select"
          name="tabs"
          value={activeTabId}
          onChange={(e) => handleTabChange(e.target.value)}
          className="block w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
              {typeof tab.count === 'number' ? ` (${tab.count})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTabId}
            className={tab.id === activeTabId ? 'animate-in fade-in-50 duration-200' : ''}
          >
            {tab.id === activeTabId && (
              <>
                {children ? children(tab) : tab.content}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
