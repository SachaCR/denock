import { assertEquals, assertMatch } from "./deps.ts";

import { DenockOptions, RequestData } from "./type.ts";

export function verifyMatch(
  options: DenockOptions,
  requestData: RequestData,
) {
  const originalUrl = new URL(requestData.originalUrl);

  assertEquals(originalUrl.host, options.host, `Denock: not match host ${originalUrl.host} ${options.host}`);
  if (options.port) assertEquals(originalUrl.port, options.port, `Denock: not match port ${originalUrl.port} ${options.port}`);

  if (options.path instanceof RegExp) {
    assertMatch(originalUrl.pathname, options.path, `Denock: not match path ${originalUrl.pathname} ${options.path}`);
  } else {
    assertEquals(originalUrl.pathname, options.path, `Denock: not match path ${originalUrl.pathname} ${options.path}`);
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
    } catch (_) {
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
