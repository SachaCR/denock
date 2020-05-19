import { HTTPMethods, RequestData } from './type.ts';

const acceptedMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

export function extractInfosFromStringAndRequestInitObject(
  input: string,
  init: RequestInit | undefined,
): RequestData {
  let originalMethod = 'GET';
  let originalBody = '{}';

  if (init) {
    if (typeof init.body !== 'string') {
      throw new Error(
        'Sorry Denock only support stringified JSON as body in RequestInit object',
      );
    }

    originalMethod = init.method ? init.method.toUpperCase() : originalMethod;

    if (!acceptedMethods.includes(originalMethod)) {
      throw new Error('Sorry Denock does not support this method');
    }

    originalBody = init.body;
  }

  return {
    originalUrl: input,
    originalBody,
    originalMethod,
  };
}
