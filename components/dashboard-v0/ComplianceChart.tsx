'use client'

// components/dashboard-v0/ComplianceChart.tsx
// v0 compliance area chart

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { month: 'Mar', value: 68 }, { month: 'Apr', value: 71 }, { month: 'Mai', value: 69 },
  { month: 'Iun', value: 74 }, { month: 'Iul', value: 72 }, { month: 'Aug', value: 76 },
  { month: 'Sep', value: 79 }, { month: 'Oct', value: 81 }, { month: 'Nov', value: 78 },
  { month: 'Dec', value: 82 }, { month: 'Ian', value: 85 }, { month: 'Feb', value: 87 },
]

export function ComplianceChart() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Conformitate Ultimele 12 Luni</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Evolu\u021bia scorului general de conformitate</p>
        </div>
        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">+19% YoY</span>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12, background: 'hsl(var(--card))' }}
              formatter={(value: number) => [`${value}%`, 'Conformitate']}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="url(#fillBlue)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
