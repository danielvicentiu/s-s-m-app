// app/[locale]/dashboard/loading.tsx
// Loading skeleton pentru dashboard

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-white px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 rounded"></div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 w-24 bg-gray-100 rounded"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-5">
        {/* Risc ITM Skeleton */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-3 w-28 bg-gray-200 rounded ml-auto"></div>
              <div className="h-12 w-20 bg-gray-200 rounded ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Value Preview Skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>

        {/* Tabs & Content Skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <div className="flex-1 py-3.5 bg-gray-50 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="flex-1 py-3.5 bg-gray-50 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="flex-1 py-3.5 bg-gray-50 border-b border-gray-200">
              <div className="h-6 w-24 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>

          {/* Counter Cards Skeleton */}
          <div className="grid grid-cols-3 gap-4 p-5">
            <div className="bg-gray-50 rounded-xl py-6">
              <div className="h-14 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="bg-gray-50 rounded-xl py-6">
              <div className="h-14 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="bg-gray-50 rounded-xl py-6">
              <div className="h-14 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-32 bg-gray-100 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="border-t border-gray-100 p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 flex-1 bg-gray-100 rounded"></div>
                <div className="h-4 flex-1 bg-gray-100 rounded"></div>
                <div className="h-4 flex-1 bg-gray-100 rounded"></div>
                <div className="h-4 w-24 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="border-t border-gray-100 px-6 py-6">
            <div className="h-4 w-full bg-gray-100 rounded"></div>
          </div>
        </div>

        {/* Active Modules Skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="h-40 bg-gray-100 rounded"></div>
        </div>

        {/* Feature Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-40 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-50 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white rounded-2xl border border-gray-200"></div>
          ))}
        </div>
      </main>
    </div>
  )
}
