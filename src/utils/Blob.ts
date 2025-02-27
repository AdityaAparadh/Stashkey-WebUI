import { BSON } from "./BSON";
import EncryptBuffer from "./EncryptBuffer";
import DecryptBuffer from "./DecryptBuffer";
import { Vault } from "../types/Vault";

/**
 * Takes in the vault as object, and the key, converts it into BSON, encrypts it and returns the blob and iv, ready to be sent to server
 * @param {object} data
 * @param {CryptoKey}key
 * @returns {Promise<{Blob, string}>} blob,iv
 */
export const getEncryptedBlobAndIV = async (
  data: object,
  key: CryptoKey,
): Promise<{ blob: Blob; iv: string }> => {
  const bson: ArrayBuffer = BSON.serialize(data);

  const { encryptedBuffer, iv } = await EncryptBuffer(bson, key);

  const blob: Blob = new Blob([encryptedBuffer], {
    type: "application/octet-stream",
  });

  return { blob, iv };
};

/**
 * Takes in the blob and iv, decrypts the blob and returns the decrypted data
 * @param {Blob} encryptedBlob
 * @param {string} iv
 * @param {CryptoKey} key
 * @returns {Promise<Vault>} decryptedData
 */

export const getDecryptedDataFromBlob = async (
  encryptedBlob: Blob,
  iv: string,
  key: CryptoKey,
): Promise<Vault> => {
  const buffer: ArrayBuffer = await encryptedBlob.arrayBuffer();

  const decryptedBuffer: ArrayBuffer = await DecryptBuffer(buffer, iv, key);
  console.log(decryptedBuffer);
  const data: object = BSON.deserialize(new Uint8Array(decryptedBuffer));
  const vault: Vault = data as Vault;
  return vault;
};
