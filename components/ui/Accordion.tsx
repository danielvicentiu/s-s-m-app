'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isOpen = (index: number) => openIndexes.includes(index);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="text-blue-600 flex-shrink-0">{item.icon}</div>
              )}
              <span className="font-medium text-gray-900">{item.title}</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                isOpen(index) ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              isOpen(index)
                ? 'max-h-[1000px] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 pt-2 text-gray-600 border-t border-gray-100">
              {typeof item.content === 'string' ? (
                <p>{item.content}</p>
              ) : (
                item.content
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
