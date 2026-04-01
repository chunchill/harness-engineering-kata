# Implementation tasks: WeChat web QR login

- [x] 1. OpenSpec: add spec delta; run `openspec validate 2026-04-01-wechat-web-login --strict`.
- [x] 2. Backend: add WeChat config, user model, session auth; implement `/auth/wechat/login`, `/auth/wechat/callback`, `/me`, `/logout`; add minimal tests.
- [x] 3. Frontend: add “WeChat login” button; call `/me` to show current user; add logout.
- [x] 4. Validate: `npm run test`.

