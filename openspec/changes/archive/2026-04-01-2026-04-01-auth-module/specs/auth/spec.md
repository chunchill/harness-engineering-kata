# auth Specification (delta: Auth module)

## ADDED Requirements

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

