'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Tab {
  key: string;
  label: string;
  icon?: LucideIcon;
  badge?: number;
  content: ReactNode;
}

interface TabsNavigationProps {
  tabs: Tab[];
  defaultTab: string;
  onChange?: (tabKey: string) => void;
  className?: string;
}

export default function TabsNavigation({
  tabs,
  defaultTab,
  onChange,
  className = '',
}: TabsNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(
    new Set([defaultTab])
  );
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Track which tabs have been rendered for lazy loading
  useEffect(() => {
    if (!renderedTabs.has(activeTab)) {
      setRenderedTabs((prev) => new Set([...prev, activeTab]));
    }
  }, [activeTab, renderedTabs]);

  // Handle tab change
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    onChange?.(tabKey);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
        let newIndex: number;

        if (e.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }

        handleTabChange(tabs[newIndex].key);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const activeButton = activeTabRef.current;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      if (
        buttonRect.left < containerRect.left ||
        buttonRect.right > containerRect.right
      ) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className={`w-full ${className}`}>
      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <div
          ref={tabsContainerRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-orientation="horizontal"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                ref={isActive ? activeTabRef : null}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.key}`}
                id={`tab-${tab.key}`}
                onClick={() => handleTabChange(tab.key)}
                className={`
                  relative flex items-center gap-2 px-1 py-4
                  text-sm font-medium whitespace-nowrap
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {/* Icon */}
                {Icon && (
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                )}

                {/* Label */}
                <span>{tab.label}</span>

                {/* Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`
                      inline-flex items-center justify-center
                      min-w-[20px] h-5 px-1.5
                      text-xs font-semibold rounded-full
                      ${
                        isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                    aria-label={`${tab.badge} items`}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}

                {/* Active Underline */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const hasBeenRendered = renderedTabs.has(tab.key);

          return (
            <div
              key={tab.key}
              role="tabpanel"
              id={`tabpanel-${tab.key}`}
              aria-labelledby={`tab-${tab.key}`}
              hidden={!isActive}
              className={isActive ? 'block' : 'hidden'}
            >
              {/* Lazy render: only render content if tab has been active at least once */}
              {hasBeenRendered ? tab.content : null}
            </div>
          );
        })}
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
