'use client';

import { useState } from 'react';

interface MobileNavProps {
  activeTab: 'panou' | 'asistenta';
  onTabChange: (tab: 'panou' | 'asistenta') => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="bg-[#1e293b] text-white p-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => onTabChange('panou')}
          className={`
            flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all
            ${activeTab === 'panou' 
              ? 'bg-white text-[#1e293b]' 
              : 'bg-[#334155] text-slate-300 hover:bg-[#475569]'
            }
          `}
        >
          Panou Principal
        </button>
        
        <button
          onClick={() => onTabChange('asistenta')}
          className={`
            flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all
            ${activeTab === 'asistenta' 
              ? 'bg-white text-[#1e293b]' 
              : 'bg-[#334155] text-slate-300 hover:bg-[#475569]'
            }
          `}
        >
          Asistență Control
        </button>
      </div>
    </div>
  );
}
