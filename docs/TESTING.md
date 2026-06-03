# Testing

The project uses [Vitest](https://vitest.dev/) with `jsdom` and Testing
Library. Tests live next to the code they cover as `*.test.ts` / `*.test.tsx`.

## Commands

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm test`              | Run the full suite once (CI mode)        |
| `npm run test:watch`    | Watch mode for local development         |
| `npm run test:coverage` | Run with a V8 coverage report            |
| `npm run typecheck`     | `tsc --noEmit` over the whole repo       |

Both `typecheck` and `test` run in CI on every push
(`.github/workflows/test.yml`).

## Coverage focus

Coverage is intentionally scoped (see `vitest.config.ts`) to the code that
holds real logic — `app/lib/**`, `app/hooks/**`, `app/kontakt/**` — rather
than the ~120 presentational components, mockup pages, and icons, where a
coverage percentage would be noise. Pure data/animation modules
(`photos.tsx`, `animations.ts`) are excluded.

## What's covered today

- **`app/lib/email.tsx`** (server action) — validation rejection, the
  in-memory rate limiter (limit, window reset, per-email buckets,
  case-insensitivity), the no-open-relay invariant (owner-only `to`,
  sender as `replyTo`), missing-config and Resend-failure branches.
- **`app/lib/schemas.ts`** — `formSchema` field boundaries and rejections.

## Roadmap (next priorities)

1. **`app/hooks/useMemoryOptimization.ts`** — `useDebounce` / `useThrottle`
   timing, cleanup hooks swallowing errors on unmount, `useNetworkStatus`
   reacting to `online`/`offline`. Use `@testing-library/react` +
   `vi.useFakeTimers()`.
2. **`app/kontakt/page.tsx`** — the contact-form state machine
   (`idle → sending → sent`, error rendering via `role="alert"`, submit
   disabled while sending) with `send` mocked.
3. **`app/lib/utils.ts`** (`cn` precedence) and
   **`app/hooks/use-outside-click.ts`** (fires on outside click only, cleans
   up listeners).
4. A single Playwright happy-path E2E for the contact journey.

## Known follow-ups surfaced by these tests

- `email.tsx`'s `rateLimitMap` is never pruned — it grows unbounded with
  distinct sender emails. Consider eviction or a real store (e.g. Redis) if
  this moves off a single long-lived server instance.
