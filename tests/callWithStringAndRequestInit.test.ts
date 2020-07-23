import { assertEquals } from "./deps.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : input string and RequestInit object
  Given the intent to call POST https://jsonplaceholder.typicode.com/todos
  When fetch() is call with a string url and a RequestInit object
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      responseBody: { test: "2" },
      replyStatus: 201,
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      }),
    });

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "2" });
    assertEquals(status, 201);
  },
);

Deno.test(
  `denock() : input string and RequestInit object
  Given the intent to call POST https://jsonplaceholder.typicode.com/todos
  When fetch() is call with a string url and a RequestInit object with on body
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      responseBody: { test: "6" },
      replyStatus: 200,
    });

    const urlObject = new URL("https://jsonplaceholder.typicode.com/todos");

    const response = await fetch(urlObject, {
      method: "GET",
    });

    const body = await response.json();
    const status = response.status;

    assertEquals(body, { test: "6" });
    assertEquals(status, 200);
  },
);
