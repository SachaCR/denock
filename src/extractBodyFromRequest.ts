import { Buffer } from "./deps.ts"

function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export async function extractBodyFromRequest(
  readableStreamReader: ReadableStreamDefaultReader,
): Promise<string> {
  async function readSteam(
    streamReader: ReadableStreamDefaultReader,
    result: Uint8Array = new Uint8Array(),
  ): Promise<Uint8Array> {
    const chunk = await readableStreamReader.read();

    if (chunk.done || !chunk.value) {
      return result;
    }

    if (isIterable(chunk.value)) {
      result = new Uint8Array([
        ...result,
        ...chunk.value
      ])
    } else {
      result = new Uint8Array([
        ...result,
        chunk.value,
      ])
    }

    return readSteam(streamReader, result);
  }

  const arrayBuffer = await readSteam(readableStreamReader);
  const textdecoder = new TextDecoder()
  const result = textdecoder.decode(arrayBuffer);

  return result;
}
