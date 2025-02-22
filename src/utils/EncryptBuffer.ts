import { arrayBufferToBase64 } from "./Base64";

/**
 * Expects an ArrayBuffer and key, generates an iv, encrypts the data with AES-256-GCM, and returns data Arraybuffer and iv as base64 encoded string
 * @param {ArrayBuffer} data
 * @param {CryptoKey} key
 * @returns {Promise<ArrayBuffer,string>} encryptedBuffer, iv
 */

const EncryptBuffer = async (
  data: ArrayBuffer,
  key: CryptoKey,
): Promise<{ encryptedBuffer: ArrayBuffer; iv: string }> => {
  const initializationVector = window.crypto.getRandomValues(
    new Uint8Array(12),
  );

  // console.log("Inside EncryptBuffer", typeof data);
  // console.log("Inside EncryptBuffer", data instanceof ArrayBuffer);

  const encryptedBuffer: ArrayBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: initializationVector,
    },
    key,
    data,
  );

  const iv: string = arrayBufferToBase64(initializationVector.buffer);
  return { encryptedBuffer, iv };
};

export default EncryptBuffer;
