import { Skeleton } from './Skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Table Header */}
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-8" />
          ))}
        </div>
      )}

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-10" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
