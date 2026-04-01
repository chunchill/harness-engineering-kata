# Change: Auth module (WeChat + phone)

## Why

Authentication should be a dedicated login/register module, not embedded directly in the task board UI.

## What changes

- Add a dedicated Auth page/module:
  - Login via WeChat web QRConnect
  - Register/login via phone number + password
- Gate the task board behind authentication:
  - Unauthenticated calls to lane/task APIs return 401

## Scope decisions (MVP)

- Use server-side session cookie (no JWT).
- Phone account = phone number + password.
- No SMS verification in MVP.

## Acceptance criteria

- When not logged in, user sees a login/register screen (not the task board).
- User can register with phone + password, then log in.
- User can log in via WeChat QR.
- After login, user enters task board; logout returns to auth screen.

