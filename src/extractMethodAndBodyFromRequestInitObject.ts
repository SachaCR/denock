const acceptedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];

export function extractMethodAndBodyFromRequestInitObject(
  init: RequestInit | undefined,
): {
  originalMethod: string;
  originalBody: string;
  originalHeaders: Headers | string[][] | Record<string, string> | undefined;
} {
  let originalMethod = "GET";
  let originalBody = "{}";
  let originalHeaders;

  if (init) {
    originalMethod = init.method ? init.method.toUpperCase() : originalMethod;

    if (!acceptedMethods.includes(originalMethod)) {
      throw new Error("Sorry Denock does not support this method");
    }

    if (init.body) {
      if (typeof init.body !== "string") {
        throw new Error(
          "Sorry Denock only support stringified JSON as body in RequestInit object",
        );
      }

      if (init.body.length > 0) {
        originalBody = init.body;
      }
    }

    originalHeaders = init.headers;
  }

  return {
    originalBody,
    originalMethod,
    originalHeaders,
  };
}
