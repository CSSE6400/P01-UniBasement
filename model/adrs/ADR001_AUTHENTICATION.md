# ADR001

## Authentication

Implementing user authentication for actions on post, patch, edit (anything that changes db).

## Options

- No user authentication or in house security
- User authentication
  - Auth0
  - OAuth2
  - NextAuth.js

Using no auth or in house auth vs Auth0
| Pros | Cons |
|----|----|
| Personalised security and easy to change the way it encrypts or stores data (in house) | Time efficient with no added risk |
| Major security risk and makes the site vulnerable (no auth) | Allows for a safer website by encrypting user information |

## Outcome

We picked Auth0 as it is a well known and trusted service that is easy to implement and is well tested. Auth0 also has a terraform provider which allows us to integrate it into our IAC for easy deployments/ teardowns. Users are authenticated using Auth0. Managed through terraform for easy deployment and teardowns.

Cannot run e2e tests on workflow because we do not have permissions in our repository to manage secrets for auth0. This meant that e2e tests can only be run locally.
