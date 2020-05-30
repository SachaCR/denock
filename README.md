# Denock

This module allow you to intercept HTTP calls. It's inspired from the NPM package [nock](https://www.npmjs.com/package/nock).
So your tests will not need `--allow-net` flag anymore.😝

The package works but is still experimental. You can use it for some tests but there is a lot to do to make it stable.

If you find issues please open an issues on github and if you want to contribute open a PR. (see TODO section below)

## Example:

```typescript
import { denock } from 'https://raw.githubusercontent.com/SachaCR/denock/master/mod.ts';
// Or
import { denock } from 'https://deno.land/x/denock/mod.ts';

denock({
  method: 'POST',
  protocol: 'https',
  host: 'jsonplaceholder.typicode.com',
  headers: [{
    header: 'content-type', value: 'application/json'
  }],
  path: '/todos',
  requestBody: {
    userId: 2,
    id: 23024,
    title: 'delectus aut autem',
    completed: false,
  },
  replyStatus: 201,
});

const urlObject = new URL('https://jsonplaceholder.typicode.com/todos');

const response = await fetch(urlObject, {
  method: 'POST',
  headers: new Headers({
    'content-type': 'application/json'
  }),
  body: JSON.stringify({
    userId: 2,
    id: 23024,
    title: 'delectus aut autem',
    completed: false,
  }),
});

const body = await response.json();

console.log(body) // ==> { test: '5' } instead of the real response.
);
```

## Options object:

- `method`: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
- `protocol`: "http" | "https"
- `host`: host to intercept
- `port`: optional port to intercept
- `path`: optional, is the path of the query
- `queryParams`?: optional, object that contains URL query parameters
- `headers`: optional. Is an array of objects representing headers
- `requestBody`: optional, this is the body that the request must contains to be intercepted
- `replyStatus`?: optional, default 200, this is the status code that will be returned on interception
- `responseBody`: this is the body that will be returned on interception;
- `interception`: optional, default 1 Represent the number of call you want to intercept;

## TODO

- [x] Implement intercept HTTP calls made with fetch with a simple string
- [x] Implement intercept HTTP calls made with fetch with a simple string and RequestInit object
- [x] Implement intercept HTTP calls made with fetch with a Request object
- [x] Implement intercept HTTP calls made with fetch with a URL object
- [x] Implement interception number
- [x] Implement matching on headers
- [ ] Implement basic authentication
