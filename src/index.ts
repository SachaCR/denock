import { DenockOptions, Interceptor, RequestData } from "./type.ts";

import { formatTargetUrlFromOptions } from "./formatTargetUrlFromOptions.ts";
import { extractMethodAndBodyFromRequestInitObject } from "./extractMethodAndBodyFromRequestInitObject.ts";
import { extractBodyFromRequest } from "./extractBodyFromRequest.ts";
import { verifyMatch } from "./verifyMatch.ts";

function denock(options: DenockOptions): Interceptor {
  const originalFetch = window.fetch;
  let callCounter = 0;
  let callLimit = 1;

  const { responseBody, interception, replyStatus } = options;

  callLimit = interception || 1;

  const targetURl = formatTargetUrlFromOptions(options);

  window.fetch = async (
    input: string | Request | URL,
    init?: RequestInit | undefined,
  ) => {
    callCounter++;

    try {
      if (typeof input === "string") {
        const {
          originalBody,
          originalMethod,
        } = extractMethodAndBodyFromRequestInitObject(init);

        verifyMatch(targetURl, options, {
          originalUrl: input,
          originalBody,
          originalMethod,
        });
      }

      if ((input as URL).toJSON !== undefined) {
        const url = input as URL;
        const {
          originalBody,
          originalMethod,
        } = extractMethodAndBodyFromRequestInitObject(init);

        verifyMatch(targetURl, options, {
          originalUrl: url.toString(),
          originalBody,
          originalMethod,
        });
      }

      if ((input as Request).clone !== undefined) {
        const request = input as Request;
        const originalUrl = request.url;
        const originalMethod = request.method.toUpperCase();
        let originalBody = "{}";

        if (request.body) {
          const readableStreamReader = request.body?.getReader();
          originalBody = await extractBodyFromRequest(readableStreamReader);
        }

        verifyMatch(targetURl, options, {
          originalUrl,
          originalMethod,
          originalBody,
        });
      }
    } catch (err) {
      window.fetch = originalFetch;
      throw err;
    }

    if (callLimit === callCounter) {
      window.fetch = originalFetch;
    }

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
      return callCounter;
    },
  };
}

export { denock };
