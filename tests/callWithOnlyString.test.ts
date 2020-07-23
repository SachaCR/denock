import { assertEquals } from "./deps.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : input string only
  Given the intent to call GET https://jsonplaceholder.typicode.com/todos/1
  When fetch() is called with only a string URL
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos/1",
      responseBody: { test: "1" },
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );
    const body = await response.json();

    assertEquals(body, { test: "1" });
  },
);
