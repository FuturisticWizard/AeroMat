import React from "react";
import type { Metadata } from "next";

// Strona w budowie — bez treści, więc wykluczamy z indeksu Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Blog = () => {
  return <div>Blog</div>;
};

export default Blog;
