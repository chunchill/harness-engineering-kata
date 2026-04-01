# auth Specification

## Purpose
TBD - created by archiving change 2026-04-01-wechat-web-login. Update Purpose after archive.
## Requirements
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

### Requirement: Phone registration and login

The system SHALL support registering and logging in using a phone number and password.

#### Scenario: Register with phone

- GIVEN the phone number is not already registered
- WHEN a client POSTs `/auth/register` with phone and password
- THEN the system creates an account and establishes a session

#### Scenario: Login with phone

- GIVEN an account exists for a phone number
- WHEN a client POSTs `/auth/login` with phone and password
- THEN the system establishes a session

### Requirement: Auth-gated APIs

Lane and task APIs SHALL require authentication.

#### Scenario: Unauthenticated access is rejected

- GIVEN the user is not logged in
- WHEN a client calls `GET /lanes` (or `GET /tasks`)
- THEN the system returns 401

