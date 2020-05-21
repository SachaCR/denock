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

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );
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
  "denock : Should intercept a call if the input is a Request object",
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
  "denock : Should detect if request body is not matching",
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

Deno.test(
  "denock : Should intercept a call if the input is a URL object",
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

Deno.test(
  "denock : Should handle when there is no body in the RequestInit object",
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
