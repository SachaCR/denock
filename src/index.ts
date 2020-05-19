import { MultiReader } from 'https://deno.land/std/io/readers.ts';

import { DenockOptions, Denock, RequestData } from './type.ts';

import { formatTargetUrlFromOptions } from './formatTargetUrlFromOptions.ts';
import { extractInfosFromStringAndRequestInitObject } from './extractInfosFromStringAndRequestInitObject.ts';
import { verifyMatch } from './verifyMatch.ts';

function denock(options: DenockOptions): Denock {
  const originalFetch = window.fetch;
  let calledTimes = 0;

  const {
    method,
    responseBody,
    headers,
    interception,
    requestBody,
    replyStatus,
  } = options;

  const targetURl = formatTargetUrlFromOptions(options);

  window.fetch = async (
    input: string | Request | URL,
    init?: RequestInit | undefined,
  ) => {
    if (calledTimes === interception) {
      throw new Error('Denock: all interception has already been used');
    }

    calledTimes++;

    if (typeof input === 'string') {
      const requestData = extractInfosFromStringAndRequestInitObject(
        input,
        init,
      );

      verifyMatch(targetURl, options, requestData);
    }

    if ((input as Request).clone !== undefined) {
      // @TODO extracto to function
      const request = input as Request;
      const originalUrl = request.url;
      const originalMethod = request.method.toUpperCase();
      let originalBody = '{}';

      if (request.body) {
        const readableStreamReader = request.body?.getReader();

        async function readSteam(
          streamReader: ReadableStreamDefaultReader,
          result: string,
        ): Promise<string> {
          const chunk = await readableStreamReader.read();

          if (chunk.done || !chunk.value) {
            return result;
          }

          result += chunk.value;

          return readSteam(streamReader, result);
        }

        originalBody = await readSteam(readableStreamReader, '');
      }

      if ((input as URL).toJSON !== undefined) {
        // @TODO
      }

      const requestData = {
        originalUrl,
        originalMethod,
        originalBody,
      };

      verifyMatch(targetURl, options, requestData);
    }

    // @TODO make sure it is always restored event if exception is thrown
    window.fetch = originalFetch;

    return {
      status: replyStatus || 200,
      json: () => responseBody as any,
    } as Response;
  };

  return {
    destroy: () => {
      window.fetch = originalFetch;
    },
    called: () => {
      return calledTimes;
    },
  };
}

export { denock };

// new URL('http://localhost:8000/test/?a=4');

// const url = {
//   href: "http://localhost:8000/test/?toto=5",
//   origin: "http://localhost:8000",
//   protocol: "http:",
//   username: "",
//   password: "",
//   host: "localhost:8000",
//   hostname: "localhost",
//   port: "8000",
//   pathname: "/test/",
//   hash: "",
//   search: "?toto=4",
// };
