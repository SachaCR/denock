import { DenockOptions } from "./type.ts";

export function formatTargetUrlFromOptions(options: DenockOptions): string {
  const { host, protocol, path, port, queryParams } = options;

  let queryParamsString = "";

  if (queryParams) {
    queryParamsString = Object.keys(queryParams).reduce((result, k, idx) => {
      if (idx > 0) {
        result += "&";
      }

      result += `${k}=${queryParams[k]}`;

      return result;
    }, "?");
  }

  const portString = port ? ":" + port : "";

  const targetUrl =
    `${protocol}://${host}${portString}${path}${queryParamsString}`;
  return targetUrl;
}
