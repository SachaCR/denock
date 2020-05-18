export interface Options {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
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
