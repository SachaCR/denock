import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { DenockOptions, RequestData } from "./type.ts";

export function verifyMatch(
  targetUrl: string,
  options: DenockOptions,
  requestData: RequestData,
) {
  if (requestData.originalUrl !== targetUrl) {
    throw new Error(
      `Denock: no match for this url : ${requestData.originalUrl}`,
    );
  }

  if (requestData.originalMethod !== options.method) {
    throw new Error(
      `Denock: method does not match: ${requestData.originalMethod}`,
    );
  }

  const originalBodyObject = JSON.parse(requestData.originalBody);

  if (options.requestBody) {
    try {
      assertEquals(originalBodyObject, options.requestBody);
    } catch (err) {
      throw new Error(
        `Denock: body does not match: ${requestData.originalBody}`,
      );
    }
  }

  if (options.headers) {
    if (requestData.originalHeaders === undefined) {
      throw new Error(
        `Denock: headers does not match: ${requestData.originalHeaders}`,
      );
    }

    const originalHeaders = new Headers(requestData.originalHeaders);

    const allHeaderMatches = options.headers.every((h) => {
      return originalHeaders.get(h.header) === h.value;
    });

    if (!allHeaderMatches) {
      throw new Error(`Denock: headers does not match`);
    }
  }
}
