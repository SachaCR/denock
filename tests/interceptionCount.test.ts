import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : interception count
  Given the intent to call 2 times GET https://jsonplaceholder.typicode.com/todos/1
  When fetch() is called 3 times
  Then the 2 first calls should be intercepted and return the expected responseBody
  And the third call should not be intercepted and throw a network access exception
  `,
  async () => {
    const interceptor = denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos/1",
      interception: 2,
      responseBody: { test: "7" },
    });

    const response1 = await fetch(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );
    const response2 = await fetch(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );

    const body1 = await response1.json();
    const body2 = await response2.json();

    assertEquals(body1, { test: "7" });
    assertEquals(body2, { test: "7" });
    assertEquals(interceptor.called(), 2);
    let error;
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
    } catch (err) {
      error = err;
    }

    assertEquals(
      error.message,
      'network access to "https://jsonplaceholder.typicode.com/todos/1", run again with the --allow-net flag',
    );
  },
);
