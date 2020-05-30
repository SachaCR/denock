export type TypeGuardResult =
  | {
    type: "string";
    stringURL: string;
  }
  | {
    type: "url";
    url: URL;
  }
  | {
    type: "request";
    request: Request;
  };

export function determineInputType(
  input: string | Request | URL,
): TypeGuardResult {
  if (typeof input === "string") {
    return {
      type: "string",
      stringURL: input,
    };
  }

  if ((input as URL).toJSON !== undefined) {
    return {
      type: "url",
      url: input as URL,
    };
  }

  if ((input as Request).clone !== undefined) {
    return {
      type: "request",
      request: input as Request,
    };
  }

  throw new Error(
    "Denock: does not handle that kind of input for fetch invocation: Use a string a Request object or a URL object",
  );
}
