import { DenockOptions, Denock, RequestData } from "./type.ts";

import { formatTargetUrlFromOptions } from "./formatTargetUrlFromOptions.ts";
import { extractMethodAndBodyFromRequestInitObject } from "./extractMethodAndBodyFromRequestInitObject.ts";
import { extractBodyFromRequest } from "./extractBodyFromRequest.ts";
import { verifyMatch } from "./verifyMatch.ts";

function denock(options: DenockOptions): Denock {
  const originalFetch = window.fetch;
  let calledTimes = 0;

  const { responseBody, interception, replyStatus } = options;

  const targetURl = formatTargetUrlFromOptions(options);

  window.fetch = async (
    input: string | Request | URL,
    init?: RequestInit | undefined,
  ) => {
    if (calledTimes === interception) {
      throw new Error("Denock: all interception has already been used");
    }

    calledTimes++;

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
      throw err;
    } finally {
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
      return calledTimes;
    },
  };
}

export { denock };
