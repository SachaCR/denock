import { Options, Denock } from "./type.ts";

function denock(options: Options): Denock {
  const originalFetch = window.fetch;
  let calledTimes = 0;

  window.fetch = async (
    input: string | Request | URL,
    init?: RequestInit | undefined,
  ) => {
    calledTimes++;
    if (typeof input !== "string") {
      throw new Error("Denock only support string url at the moment");
    }

    const {
      host,
      method,
      protocol,
      responseBody,
      headers,
      interception,
      path,
      port,
      requestBody,
      queryParams,
      replyStatus,
    } = options;

    let queryParamsString = "";

    if (queryParams) {
      queryParamsString = Object.keys(queryParams).reduce(
        (result, k, idx) => {
          if (idx > 0) {
            result += "&";
          }

          result += `${k}=${queryParams[k]}`;

          return result;
        },
        "?",
      );
    }

    const portString = port ? ":" + port : "";

    const targetUrl =
      `${protocol}://${host}${portString}${path}${queryParamsString}`;

    //console.log("targetUrl >>>>>>>>>", targetUrl);

    if (input.toString() !== targetUrl.toString()) {
      throw new Error(`Denock: no match for this url : ${input}`);
    }

    if (init) {
      const originalMethod = init.method || "GET";

      if (typeof init.body !== "string") {
        throw new Error("Denock only support string body at the moment");
      }

      const originalBody = JSON.parse(init.body);

      if (originalMethod !== method) {
        throw new Error(`Denock: no method match : ${originalMethod}`);
      }

      if (requestBody && originalBody !== requestBody) {
        throw new Error(`Denock: no body match : ${originalMethod}`);
      }
    }

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
