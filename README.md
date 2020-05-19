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
  path: '/todos',
  responseBody: { test: '5' },
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

## TODO

- [x] Implement intercept HTTP calls made with fetch with a simple string
- [x] Implement intercept HTTP calls made with fetch with a simple string and RequestInit object
- [x] Implement intercept HTTP calls made with fetch with a Request object
- [x] Implement intercept HTTP calls made with fetch with a URL object
- [] Implement interception number
- [] Implement matching on headers
- [] Implement basic authentication
