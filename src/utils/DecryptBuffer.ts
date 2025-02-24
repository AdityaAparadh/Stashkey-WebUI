import { base64ToArrayBuffer } from "./Base64";

/**
 * Takes in encrypted ArrayBuffer and iv (string encoded with base64), and a key, and decrypts the data using the key assuming encrypted with AES-256-GCM
 * @param{ArrayBuffer} data
 * @param{string} iv
 * @param{CryptoKey} key
 * @returns{Promise<ArrayBuffer>} Decrypted data
 */
const DecryptBuffer = async (
  data: ArrayBuffer,
  iv: string,
  key: CryptoKey,
): Promise<ArrayBuffer> => {
  const ivBuffer = new Uint8Array(base64ToArrayBuffer(iv)).buffer;

  // console.log("Inside DecryptBuffer", typeof data);
  // console.log("Inside DecryptBuffer", data instanceof ArrayBuffer);
  // console.log("Inside DecryptBuffer", ivBuffer instanceof ArrayBuffer);
  // console.log("Inside DecryptBuffer", key instanceof CryptoKey);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    data,
  );
  return decryptedBuffer;
};

export default DecryptBuffer;
