export default function Loading() {
  return (
    <div className="min-h-screen bg-black py-8 mt-20">
      <div className="container mx-auto py-12 px-4 md:py-20">
        <div className="max-w-3xl animate-pulse">
          <div className="h-12 md:h-16 w-3/4 rounded-md bg-neutral-900 mb-6" />
          <div className="h-4 w-full rounded bg-neutral-900 mb-2" />
          <div className="h-4 w-5/6 rounded bg-neutral-900 mb-2" />
          <div className="h-4 w-4/6 rounded bg-neutral-900" />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-neutral-900"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
