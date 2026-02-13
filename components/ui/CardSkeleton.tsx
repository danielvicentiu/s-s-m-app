import { Skeleton } from './Skeleton';

interface CardSkeletonProps {
  rows?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function CardSkeleton({
  rows = 3,
  showHeader = true,
  showFooter = false,
}: CardSkeletonProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      {/* Card Header */}
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {/* Card Content */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={`content-${i}`} className="h-4 w-full" />
        ))}
      </div>

      {/* Card Footer */}
      {showFooter && (
        <div className="pt-4 border-t border-gray-200">
          <Skeleton className="h-10 w-32" />
        </div>
      )}
    </div>
  );
}

interface CardGridSkeletonProps {
  cards?: number;
  columns?: number;
  cardProps?: CardSkeletonProps;
}

export function CardGridSkeleton({
  cards = 6,
  columns = 3,
  cardProps,
}: CardGridSkeletonProps) {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={`card-${i}`} {...cardProps} />
      ))}
    </div>
  );
}
