'use client';

export default function SessionsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
      <div className="h-6 w-64 animate-pulse rounded bg-neutral-200" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100"
          />
        ))}
      </div>
    </div>
  );
}
