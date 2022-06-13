import { assertEquals, assertMatch } from "./deps.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : destroy()
  Given the intent to call 2 times GET https://jsonplaceholder.typicode.com/todos/1
  When interceptor.destroy() is called before the second call
  Then the second call should not be intercepted
  `,
  async () => {
    const interceptor = denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos/1",
      interception: 2,
      responseBody: { test: "8" },
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );
    const body = await response.json();

    assertEquals(body, { test: "8" });

    interceptor.destroy();

    let error;
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
    } catch (err) {
      error = err;
    }

    assertMatch(error.message, /--allow-net/);
  },
);
