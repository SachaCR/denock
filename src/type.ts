export type HTTPMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface DenockOptions {
  method: HTTPMethods;
  protocol: "http" | "https";
  host: string;
  port?: number;
  path?: string | RegExp;
  queryParams?: any;
  headers?: Array<{ header: string; value: string }>;
  /** This is the body that the request must contains to be intercepted*/
  requestBody?: any;
  /** This is the status code that will be returned on interception*/
  replyStatus?: number;
  /** This is the body that will be returned on interception*/
  responseBody: any;
  /** Represent the number of call you wants to intercept*/
  interception?: number;

  passthrough?: boolean; // if true it pass the same request to the global handler
}

export interface Interceptor {
  /** Deactivate the interceptor*/
  destroy: () => void;
  /** Return the current number of interception*/
  called: () => number;
}

export interface RequestData {
  originalUrl: string;
  originalMethod: string;
  originalBody: string;
  originalHeaders: Headers | string[][] | Record<string, string> | undefined;
}
