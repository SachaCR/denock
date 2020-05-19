export type HTTPMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface DenockOptions {
  method: HTTPMethods;
  protocol: "http" | "https";
  host: string;
  port?: number;
  path?: string;
  queryParams?: any;
  headers?: Array<{ header: string; value: string }>;
  requestBody?: any;
  replyStatus?: number;
  responseBody: any;
  interception?: number;
}

export interface Denock {
  destroy: () => void;
  called: () => number;
}

export interface RequestData {
  originalUrl: string;
  originalMethod: string;
  originalBody: string;
}
