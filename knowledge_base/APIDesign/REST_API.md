# REST API Design Guide

## What is REST?

REST (Representational State Transfer) is an architectural style for designing APIs.

## HTTP Methods

GET - Retrieve data

POST - Create new data

PUT - Update existing data

DELETE - Delete data

PATCH - Partially update data

## Naming

Good:

GET /users

GET /users/{id}

POST /users

DELETE /users/{id}

Bad:

GET /getUsers

POST /createUser

## Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

404 Not Found

500 Internal Server Error

## Best Practices

- Use nouns instead of verbs
- Version your APIs
- Validate inputs
- Return JSON
- Handle errors properly