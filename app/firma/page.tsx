import React from "react";
import type { Metadata } from "next";

// Strona w budowie — bez treści, więc wykluczamy z indeksu Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Firma = () => {
  return <div>Firma</div>;
};

export default Firma;
