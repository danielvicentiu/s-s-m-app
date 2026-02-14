'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenFirst?: boolean;
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenFirst = false,
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(
    defaultOpenFirst ? new Set([0]) : new Set()
  );

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev);

      if (allowMultiple) {
        // Multiple items can be open
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } else {
        // Only one item can be open
        if (newSet.has(index)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(index);
        }
      }

      return newSet;
    });
  };

  return (
    <div className="w-full divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);

        return (
          <div key={index} className="w-full">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.icon && (
                  <div className="flex-shrink-0 text-gray-600">
                    {item.icon}
                  </div>
                )}
                <span className="font-medium text-gray-900 truncate">
                  {item.title}
                </span>
              </div>

              <ChevronDown
                className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
