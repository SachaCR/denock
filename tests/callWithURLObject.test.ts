import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : URL object
  Given the intent to call POST https://jsonplaceholder.typicode.com/todos
  When fetch() is call with a URL object
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      responseBody: { test: "5" },
      requestBody: {
        userId: 2,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      },
      replyStatus: 201,
    });

    const urlObject = new URL("https://jsonplaceholder.typicode.com/todos");

    const response = await fetch(urlObject, {
      method: "POST",
      body: JSON.stringify({
        userId: 2,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      }),
    });

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "5" });
    assertEquals(status, 201);
  },
);
