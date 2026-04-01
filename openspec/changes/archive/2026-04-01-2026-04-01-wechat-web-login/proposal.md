# Change: WeChat web QR login (Open Platform)

## Why

We want users to authenticate via WeChat without creating a separate password-based account.

## What changes

- Add a WeChat “scan QR to login” flow:
  - `GET /auth/wechat/login` redirects to WeChat QRConnect with a CSRF-style `state`
  - `GET /auth/wechat/callback` handles WeChat’s `code` and establishes a server session
- Add a current-user endpoint:
  - `GET /me` returns the authenticated user, or `401` if not logged in
- Add logout:
  - `POST /logout` clears the session

## Scope decisions (MVP)

- Use **server-side session cookie** (no JWT yet).
- Persist a minimal user record keyed by WeChat `openid`.
- No authorization / RBAC; only authentication.
- UI: add a simple “WeChat login” entry and show logged-in user.

## Acceptance criteria

- User can click “WeChat login”, scan QR code, and return to the app logged in.
- `GET /me` returns the user when logged in; returns `401` when logged out.

