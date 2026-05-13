# Fix: `/admin/login` stuck on spinner

## What's happening

`AdminLogin.tsx` shows the spinner while `useAuth().loading === true`. The page loads fine for visitors with no session (verified on the live site just now), but stays on the spinner for users who already have a Supabase session cached in `localStorage` (e.g. Mahima, who logged in earlier).

## Root cause

`src/hooks/useAuth.tsx` does this inside `onAuthStateChange`:

```ts
supabase.auth.onAuthStateChange(async (event, session) => {
  ...
  if (session?.user) {
    const { data: roleData } = await supabase
      .from("user_roles").select("role")
      .eq("user_id", session.user.id).maybeSingle();   // <-- await inside listener
    setRole(roleData?.role ?? "student");
  }
  setLoading(false);
});
```

Awaiting a Supabase call inside an `onAuthStateChange` callback is a documented deadlock — the auth client is locked while the callback runs, so the nested query never resolves. `setLoading(false)` is therefore never reached and the spinner spins forever. Anyone with a restored session sees this; visitors with no session don't (the `else` branch returns immediately).

## Fix

Restructure `useAuth.tsx` so the listener only does synchronous state updates, and the role fetch happens outside it.

1. In `onAuthStateChange`, set `session`/`user` synchronously and trigger the role fetch via `setTimeout(() => fetchRole(session.user.id), 0)` (fire-and-forget, breaks the lock). When `session` is null, clear role and `setLoading(false)` immediately.
2. Extract a `fetchRole(userId)` helper that runs the `user_roles` query, calls `setRole(...)`, and then `setLoading(false)`.
3. Keep the initial `getSession()` call, but route it through the same `fetchRole` helper instead of a duplicated chained `.then`.
4. Add a safety timeout (e.g. 5s) that forces `setLoading(false)` so a future regression can never strand the UI on a spinner again.

No schema, RLS, or routing changes are needed. After the patch is published, Mahima's stale session will resolve and `/admin/login` will either render the form or auto-redirect her to `/admin/dashboard`.

## Files to change

- `src/hooks/useAuth.tsx` — refactor as described above.

## Verification

- Reload `/admin/login` while logged out → form renders.
- Reload `/admin/login` while logged in as Mahima → redirects to `/admin/dashboard`.
- Confirm no console errors and the spinner never persists more than ~1s.

## After implementation

User must click **Publish → Update** so the fix reaches `syncroomies.com` (frontend changes don't auto-deploy).
