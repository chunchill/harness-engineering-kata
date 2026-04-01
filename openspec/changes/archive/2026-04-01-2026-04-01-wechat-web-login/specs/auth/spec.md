# auth Specification (delta: WeChat web QR login)

## ADDED Requirements

### Requirement: WeChat QR login (web)

The system SHALL support logging in via WeChat Open Platform QRConnect.

#### Scenario: Start login redirects to WeChat

- GIVEN the system is running
- WHEN a client GETs `/auth/wechat/login`
- THEN the system responds with a redirect to WeChat QRConnect including a `state` value

#### Scenario: Callback establishes a session

- GIVEN a client has been redirected back from WeChat with `code` and `state`
- WHEN the client GETs `/auth/wechat/callback?code=...&state=...`
- THEN the system validates the `state`, exchanges the code for WeChat identity, creates or finds a local user, and establishes a session

### Requirement: Current user endpoint

The system SHALL expose the authenticated user.

#### Scenario: Get current user when logged in

- GIVEN the user is logged in
- WHEN a client GETs `/me`
- THEN the system returns the current user

#### Scenario: Get current user when logged out

- GIVEN the user is not logged in
- WHEN a client GETs `/me`
- THEN the system returns `401`

