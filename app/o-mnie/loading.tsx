export default function Loading() {
  return (
    <div className="min-h-screen bg-black py-20 mt-20">
      <div className="container mx-auto px-4 md:px-6 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] rounded-lg bg-neutral-900" />
          <div className="space-y-5">
            <div className="h-10 md:h-14 w-3/4 rounded-md bg-neutral-900" />
            <div className="h-4 w-full rounded bg-neutral-900" />
            <div className="h-4 w-11/12 rounded bg-neutral-900" />
            <div className="h-4 w-10/12 rounded bg-neutral-900" />
            <div className="h-4 w-9/12 rounded bg-neutral-900" />
            <div className="mt-8 h-12 w-40 rounded-full bg-accent/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
