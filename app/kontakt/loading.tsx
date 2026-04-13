export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/85" aria-hidden />
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-2xl animate-pulse">
          <div className="mx-auto h-3 w-40 rounded bg-neutral-800" />
          <div className="mt-6 mx-auto h-16 md:h-20 w-3/4 rounded-md bg-neutral-900" />
          <div className="mt-12 h-14 w-full rounded-md bg-neutral-900" />
          <div className="mt-10 flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-neutral-800" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-1 w-6 rounded-full bg-neutral-800" />
              ))}
            </div>
            <div className="h-10 w-32 rounded-full bg-[#ff7302]/40" />
          </div>
        </div>
      </section>
    </main>
  );
}
