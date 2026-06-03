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
- **`app/lib/utils.ts`** — `cn` joins, drops falsy values, and resolves
  conflicting Tailwind classes (later wins).
- **`app/hooks/useMemoryOptimization.ts`** — `useDebounce` collapse + unmount
  cleanup, `useThrottle` interval gating, `useMemoryCleanup` /
  `useResourceCleanup` running (and error-swallowing) on unmount,
  `useNetworkStatus` reacting to `online`/`offline`.
- **`app/hooks/use-outside-click.ts`** — fires on outside mousedown/touchstart
  only, ignores clicks inside, detaches listeners on unmount.
- **`app/kontakt/page.tsx`** — the contact-form state machine: valid submit →
  success panel with personalised name, `send` rejection → error alert,
  invalid input blocks submission.

## Roadmap (next priorities)

1. A single Playwright happy-path E2E for the contact journey (browser-level,
   complementing the mocked component test above).

## Known follow-ups surfaced by these tests

- `email.tsx`'s `rateLimitMap` is never pruned — it grows unbounded with
  distinct sender emails. Consider eviction or a real store (e.g. Redis) if
  this moves off a single long-lived server instance.
