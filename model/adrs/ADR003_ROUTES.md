# ADR003

## ROUTES

Introduce more files to decrease the size of routes.ts and as such improve readability and maintainability of code

## Options

- All route functions in routes.ts
- Route functions in files based of their path i.e. /courses goes to courses.ts
  
### Why choose one file over separate files

| Pros | Cons |
|----|----|
| All routes are easy to find since they are all in the one file | Easier to search for functionality as question based routes are grouped in questions.ts |
| - | Having a large file can be hard to read and understand, making it more difficult to understand and debug |

## Outcome

Moved the routes to their separate files to increase readability of the code.
