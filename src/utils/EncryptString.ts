import { arrayBufferToBase64 } from "./Base64";

/**
 * Expects string data and key, generates an iv, encrypts the data with AES-256-GCM, encodes both to base64 and returns them
 * @param {string} data
 * @param {CryptoKey} key
 * @returns {string}
 */

const EncryptString = async (
  data: string,
  key: CryptoKey,
): Promise<{ encryptedData: string; iv: string }> => {
  const initializationVector = window.crypto.getRandomValues(
    new Uint8Array(12),
  );

  const buffer = new TextEncoder().encode(data);

  const encryptedBuffer: ArrayBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: initializationVector,
    },
    key,
    buffer,
  );

  const encryptedData: string = arrayBufferToBase64(encryptedBuffer);
  const iv: string = arrayBufferToBase64(initializationVector.buffer);
  return { encryptedData, iv };
};

export default EncryptString;
