import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { denock } from "./index.ts";

Deno.test(
  "denock : Should intercept a call if the input is a url string",
  async () => {
    denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos/1",
      responseBody: { test: "1" },
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
    const body = await response.json();

    assertEquals(body, { test: "1" });
  },
);

Deno.test(
  "denock : Should intercept a call if the input is a string and a RequestInit object",
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      responseBody: { test: "2" },
      replyStatus: 201,
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos`,
      {
        method: "POST",
        body: JSON.stringify({
          "userId": 1,
          "id": 23024,
          "title": "delectus aut autem",
          "completed": false,
        }),
      },
    );

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "2" });
    assertEquals(status, 201);
  },
);
