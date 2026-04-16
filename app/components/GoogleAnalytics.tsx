"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Tracks SPA route changes and fires page_view events.
// Wrapped in Suspense because useSearchParams requires a suspense boundary in App Router.
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : "");
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      send_to: GA_ID,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  // Render nothing if the env var is missing — keeps local/preview clean of dangling GA script
  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
