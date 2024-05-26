# ADR002

## ORM

Introduce an ORM to reduce coupling between the data and backend layers.

## Options

- No ORM  
- Orm
  
### No ORM over ORM

| Pros | Cons |
|----|----|
| Deveolpers that are more comfortable in SQL can use SQL over an unfamilar package | The syntax and functions are more similar to the code language in use, helping devs understand code easier |
| - | Decouples the backend away from the current package 'pg' which can only use postgreSQL and as such couples the backend and database layers |
| - | Allows for easier testing as it opens up for different databased to be used there |
| - | Overall less boilerplate to do some things reduce the amount of code / failure points |

## Outcome

Introduced TypeORM on the backend due to the cons of having no ORM being more siginificant than the pros.
