export async function extractBodyFromRequest(
  readableStreamReader: ReadableStreamDefaultReader,
): Promise<string> {
  async function readSteam(
    streamReader: ReadableStreamDefaultReader,
    result: string,
  ): Promise<string> {
    const chunk = await readableStreamReader.read();

    if (chunk.done || !chunk.value) {
      return result;
    }

    result += chunk.value;

    return readSteam(streamReader, result);
  }

  return await readSteam(readableStreamReader, "");
}
