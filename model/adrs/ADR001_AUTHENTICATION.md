# ADR001

## Authentication

Implementing user authentication for actions on post, patch, edit (anything that changes db).

## Options

- No user authentication
- User authentication
  - Auth0
  - OAuth2
  - NextAuth.js

We picked auth0 as it is a well known and trusted service that is easy to implement and is well tested. Auth0 also has a terraform provider which allows us to integrate it into our IAC for easy deployments/ teardowns.

## Outcome

Users are authenticated using Auth0. Managed through terraform for easy deployment and teardowns. Cannot run e2e tests on workflow because we do not have permissions in our repository to manage secrets for auth0. This meant that e2e tests can only be run locally.
