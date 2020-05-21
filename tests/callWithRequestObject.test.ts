import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : with Request object
  Given the intent to call POST https://jsonplaceholder.typicode.com/todos
  When fetch() is call with a Request object
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      queryParams: { test: "a" },
      responseBody: { test: "3" },
      replyStatus: 201,
    });

    const request: Request = new Request(
      `https://jsonplaceholder.typicode.com/todos?test=a`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: 1,
          id: 23024,
          title: "delectus aut autem",
          completed: false,
        }),
      },
    );

    const response = await fetch(request);

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "3" });
    assertEquals(status, 201);
  },
);

Deno.test(
  `denock() : with Request object
  Given the intent to call fetch() POST https://jsonplaceholder.typicode.com/todos with a Request object
  When the payload is different
  Then we should throw an error: Denock: body does not match
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      responseBody: { test: "4" },
      requestBody: {
        userId: 1,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      },
      replyStatus: 201,
    });

    const request: Request = new Request(
      `https://jsonplaceholder.typicode.com/todos`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: 2,
          id: 23024,
          title: "delectus aut autem",
          completed: false,
        }),
      },
    );

    let error;

    try {
      await fetch(request);
    } catch (err) {
      error = err;
    }

    assertEquals(
      error.message,
      'Denock: body does not match: {"userId":2,"id":23024,"title":"delectus aut autem","completed":false}',
    );
  },
);
