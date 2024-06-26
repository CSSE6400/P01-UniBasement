# ADR004

## Integration Testing

Connecting the integration tests to the database.

## Options

- Leaving integration tests to only verify return HTTP code and response.
- Allowing integration tests to connect to the database to verify HTTP code, response and changes were made to the database.

1st option vs 2nd option
| Pros | Cons |
|----|----|
| Easy to do and should test everything | There may be some things that are not 100% safe and may fail when a second computer is added |
| TIme efficient | Better aligns with quality attributes |

## Outcome

This ADR was the decision to utilise ADR002 and allow the integrations tests to connect with the database. This allow the tests to verify changes made through the backend by directly communicating with the DB. By implementing this ADR we have increased the maintainability QA and reliability as we can now verify changes made to the database through the backend. This gives developers more confidence in the changes they made and allows for better test coverage.
