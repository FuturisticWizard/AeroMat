import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
      // Focus coverage on logic; exclude presentational/mockup/icon code.
      include: ["app/lib/**", "app/hooks/**", "app/kontakt/**"],
      exclude: [
        "app/**/*.{test,spec}.{ts,tsx}",
        "app/lib/photos.tsx",
        "app/lib/animations.ts",
      ],
    },
  },
});
