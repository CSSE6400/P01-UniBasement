# ADR005

## User Roles

Implementing authentication of user actions. Every post/ patch/ edit action will be associated with a user ID.

## Options

- Implement user roles in the database
  - Regular user and Admin user roles
- Not implementing roles

## Outcome

By implementing this ADR, we can ensure that users are only able to edit or delete their own content or content they are allowed to edit. This will prevent unauthorized users from making changes to the database. Frontend authentication handled by Auth0. Backend user table added to track user IDs and associate with comments.
An improvement we could make is utilising auth0 custom roles/ metadata to manage user roles. This would allow us to manage users completely through auth0 instead of handling it in our backend.
