import { base64ToArrayBuffer } from "./Base64";

/**
 * Takes in encrypted string and iv (encoded with base64), and a key, and decrypts the data using the key assuming encrypted with AES-256-GCM
 * @param data
 * @param iv
 * @param key
 * @returns
 */
const DecryptString = async (
  data: string,
  iv: string,
  key: CryptoKey,
): Promise<string> => {
  const dataBuffer = base64ToArrayBuffer(data);
  const ivBuffer = new Uint8Array(base64ToArrayBuffer(iv));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    dataBuffer,
  );
  return new TextDecoder().decode(decryptedBuffer);
};

export default DecryptString;
