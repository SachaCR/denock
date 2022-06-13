import { DenockOptions, Interceptor, RequestData } from "./type.ts";
import { extractMethodAndBodyFromRequestInitObject } from "./extractMethodAndBodyFromRequestInitObject.ts";
import { extractBodyFromRequest } from "./extractBodyFromRequest.ts";
import { verifyMatch } from "./verifyMatch.ts";
import { TypeGuardResult, determineInputType } from "./typeguard.ts";

function denock(options: DenockOptions): Interceptor {
  const originalFetch = self.fetch;
  let callCounter = 0;
  let callLimit = 1;

  const { responseBody, interception, replyStatus } = options;

  callLimit = interception || 1;

  self.fetch = async (
    input: string | Request | URL,
    init?: RequestInit | undefined
  ) => {
    callCounter++;

    try {
      const inputTypeResult = determineInputType(input);

      let originalUrl: string;

      let {
        originalBody,
        originalMethod,
        originalHeaders,
      } = extractMethodAndBodyFromRequestInitObject(init);

      switch (inputTypeResult.type) {
        case "string":
          originalUrl = inputTypeResult.stringURL;
          break;

        case "url":
          originalUrl = inputTypeResult.url.toString();
          break;

        case "request": {
          const request = inputTypeResult.request;
          originalUrl = inputTypeResult.request.url;
          originalMethod = inputTypeResult.request.method.toUpperCase();

          if (request.body) {
            const readableStreamReader = request.body?.getReader();

            const extractedBody = await extractBodyFromRequest(
              readableStreamReader
            );

            originalBody = extractedBody ? extractedBody : originalBody;
          }

          originalHeaders = request.headers;
          break;
        }
        default: {
          const unknownType: never = inputTypeResult;
          throw new TypeError(`Denock: Unknown type for input: ${unknownType}`);
        }
      }

      verifyMatch(options, {
        originalUrl,
        originalBody,
        originalMethod,
        originalHeaders,
      });
    } catch (err) {
      self.fetch = originalFetch;
      throw err;
    }

    if (callLimit === callCounter) {
      self.fetch = originalFetch;
    }

    return {
      ok: replyStatus === undefined || replyStatus < 400 ? true : false,
      status: replyStatus || 200,
      json: () => responseBody as any,
      text: () => responseBody as any,
      arrayBuffer: () => responseBody as any,
      blob: () => responseBody as any,
      formData: () => responseBody as any,
    } as Response;
  };

  return {
    destroy: () => {
      globalThis.fetch = originalFetch;
    },
    called: () => {
      return callCounter;
    },
  };
}

export { denock };
