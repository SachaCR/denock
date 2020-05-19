# Denock

This module allow you to intercept HTTP calls. It's inspired from the NPM package nock.

Still a work in progress

## Example:

```typescript
denock({
  method: 'POST',
  protocol: 'https',
  host: 'jsonplaceholder.typicode.com',
  path: '/todos',
  responseBody: { test: '4' },
  requestBody: {
    userId: 1,
    id: 23024,
    title: 'delectus aut autem',
    completed: false,
  },
  replyStatus: 201,
});

const request: Request = new Request(
  `https://jsonplaceholder.typicode.com/todos`,
  {
    method: 'POST',
    body: JSON.stringify({
      userId: 1,
      id: 23024,
      title: 'delectus aut autem',
      completed: false,
    }),
  },

  request.body, // ==> { test: '4' } instead of the real response.
);
```
