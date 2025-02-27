/**
 * BSON was removed due to issues in bundling. This is a temporary implementation to mimic its API.
 * @todo Fix this to use BSON
 */
export class BSON {
  public static serialize(document: any): Uint8Array {
    const jsonString = JSON.stringify(document);
    const encoder = new TextEncoder();
    return encoder.encode(jsonString);
  }

  public static deserialize(buffer: Uint8Array): any {
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(buffer);
    return JSON.parse(jsonString);
  }
}
