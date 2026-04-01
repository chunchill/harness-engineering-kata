# Implementation tasks: Auth module (WeChat + phone)

- [x] 1. OpenSpec: add spec delta; run `openspec validate 2026-04-01-auth-module --strict`.
- [x] 2. Backend: add unified `users` table (phone + wechat openid), session auth, endpoints: register/login/me/logout + wechat login/callback; add basic tests.
- [x] 3. Backend: protect `/tasks/**` and `/lanes/**` to require auth (401 when not logged in).
- [x] 4. Frontend: add Auth page (login/register tabs + WeChat button) and gate TaskBoard behind auth.
- [x] 5. Validate: `npm run test`.

