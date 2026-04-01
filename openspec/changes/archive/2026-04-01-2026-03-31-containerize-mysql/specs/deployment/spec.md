# Deployment Specification (Delta: Containerized stack + MySQL)

## ADDED Requirements

### Requirement: Compose-based full-stack bring-up

The repository SHALL provide a `docker compose` configuration that can bring up:

- MySQL database
- Backend API service
- Frontend UI service

in a single command (`docker compose up`), with clear ports documented.

#### Scenario: First-time bring-up

- GIVEN a developer has Docker installed
- WHEN they run `docker compose up` from repo root
- THEN the stack starts successfully and the UI can reach the API and database without manual local installs

### Requirement: MySQL is containerized

MySQL SHALL run as a container with a persistent volume, and SHALL expose health status to allow dependent services to wait for readiness.

#### Scenario: Database readiness

- GIVEN the stack is starting
- WHEN MySQL becomes ready
- THEN healthchecks pass and the backend can connect and serve requests

### Requirement: Repeatable reset

The system SHALL document how to reset the stack to a clean slate (including deleting the database volume).

#### Scenario: Reset to clean state

- GIVEN the stack has been started and data exists in MySQL
- WHEN the developer runs the documented reset procedure (including removing volumes)
- THEN a subsequent `docker compose up` starts from an empty database state

