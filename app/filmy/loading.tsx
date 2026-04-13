export default function Loading() {
  return (
    <div className="min-h-screen bg-black py-20 mt-20">
      <div className="container mx-auto px-4 md:px-6 animate-pulse">
        <div className="max-w-3xl mb-12">
          <div className="h-10 md:h-14 w-2/3 rounded-md bg-neutral-900 mb-4" />
          <div className="h-4 w-5/6 rounded bg-neutral-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-lg bg-neutral-900"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
