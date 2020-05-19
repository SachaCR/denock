# Denock

This module allow you to intercept HTTP calls. It's inspired from the NPM package nock.

The package works but is still experimental. You can use it for some tests but there is a lot to do to make it stable.

If you find issues please open an issues on github and if you want to contribute open a PR. (see TODO section below)

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

## TODO

- [x] Implement intercept HTTP calls made with fetch with a simple string
- [x] Implement intercept HTTP calls made with fetch with a simple string and RequestInit object
- [x] Implement intercept HTTP calls made with fetch with a Request object
- [x] Implement intercept HTTP calls made with fetch with a URL object
- [] Implement interception number
- [] Implement matching on headers
- [] Implement basic authentication
