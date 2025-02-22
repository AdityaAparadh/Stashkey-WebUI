/**
 * Takes in an arrayBuffer and returns a base64 encoded string
 * @param {ArrayBuffer}buffer
 * @returns {string} base64 encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binaryString = "";
  uint8Array.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
}

/**
 * Takes in a base64 encoded string and returns an arrayBuffer
 * @param {string} base64
 * @returns {ArrayBuffer}
 */

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const buffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return buffer;
}
