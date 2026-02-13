import { Skeleton } from './Skeleton';

interface FormSkeletonProps {
  fields?: number;
  showSubmitButton?: boolean;
  columns?: number;
}

export function FormSkeleton({
  fields = 4,
  showSubmitButton = true,
  columns = 1,
}: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : '1fr',
        }}
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={`field-${i}`} className="space-y-2">
            {/* Label */}
            <Skeleton className="h-4 w-24" />
            {/* Input */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {showSubmitButton && (
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  );
}

interface FormCardSkeletonProps extends FormSkeletonProps {
  showHeader?: boolean;
}

export function FormCardSkeleton({
  fields = 4,
  showSubmitButton = true,
  columns = 1,
  showHeader = true,
}: FormCardSkeletonProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
      {/* Card Header */}
      {showHeader && (
        <div className="space-y-2 pb-4 border-b border-gray-200">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      {/* Form */}
      <FormSkeleton
        fields={fields}
        showSubmitButton={showSubmitButton}
        columns={columns}
      />
    </div>
  );
}
