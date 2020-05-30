import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { denock } from "../mod.ts";

Deno.test(
  `denock() : matching headers
  Given the intent to intercept call that have headers toto = test
  When fetch() is called with corresponding headers
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      headers: [
        {
          header: "toto",
          value: "test",
        },
      ],
      responseBody: { test: "ok" },
      replyStatus: 201,
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
      method: "POST",
      headers: {
        toto: "test",
      },
      body: JSON.stringify({
        userId: 1,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      }),
    });

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "ok" });
    assertEquals(status, 201);
  },
);

Deno.test(
  `denock() : matching headers
  Given the intent to intercept call that have headers toto = test
  When fetch() is called with no headers
  Then the call should be intercepted and throw an error
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      headers: [
        {
          header: "toto",
          value: "test",
        },
      ],
      responseBody: { test: "ok" },
      replyStatus: 201,
    });

    let error;

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: "POST",
        body: JSON.stringify({
          userId: 1,
          id: 23024,
          title: "delectus aut autem",
          completed: false,
        }),
      });
    } catch (err) {
      error = err;
    }

    assertEquals(error.message, "Denock: headers does not match: undefined");
  },
);

Deno.test(
  `denock() : matching headers
  Given the intent to intercept call that have headers toto = test
  When fetch() is called with corresponding headers in string array format
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      headers: [
        {
          header: "toto",
          value: "test",
        },
      ],
      responseBody: { test: "ok" },
      replyStatus: 201,
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
      method: "POST",
      headers: [["toto", "test"]],
      body: JSON.stringify({
        userId: 1,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      }),
    });

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "ok" });
    assertEquals(status, 201);
  },
);

Deno.test(
  `denock() : matching headers
  Given the intent to intercept call that have headers toto = test
  When fetch() is called with corresponding headers in a Header object
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "POST",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      headers: [
        {
          header: "toto",
          value: "test",
        },
      ],
      responseBody: { test: "ok" },
      replyStatus: 201,
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
      method: "POST",
      headers: new Headers({ toto: "test" }),
      body: JSON.stringify({
        userId: 1,
        id: 23024,
        title: "delectus aut autem",
        completed: false,
      }),
    });

    const body = await response.json();
    const status = await response.status;

    assertEquals(body, { test: "ok" });
    assertEquals(status, 201);
  },
);

Deno.test(
  `denock() : Header matching with Request object
  Given the intent to intercept call that have headers toto = test
  When fetch() is called with corresponding headers in a Header object
  Then the call should be intercepted and return the expected responseBody
  `,
  async () => {
    denock({
      method: "GET",
      protocol: "https",
      host: "jsonplaceholder.typicode.com",
      path: "/todos",
      headers: [
        {
          header: "content-type",
          value: "application/json",
        },
      ],
      responseBody: { test: "ok" },
      replyStatus: 200,
    });

    const url = "https://jsonplaceholder.typicode.com/todos";
    const request = new Request(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    const response = await fetch(request);

    const body = await response.json();
    const status = response.status;

    assertEquals(body, { test: "ok" });
    assertEquals(status, 200);
  },
);
