/**
 * Takes in two strings for password and salt, applies PBKDF2 with given no of iterations and returns a nonexportable key
 * @param {string} password
 * @param {string} salt
 * @param {number} iterations
 * @returns {Promise<CryptoKey>}
 */

export const createKey = async (
  password: string,
  salt: string,
  iterations: number,
  exportable: boolean,
): Promise<CryptoKey> => {
  const keybuffer: ArrayBuffer = new TextEncoder().encode(password);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    keybuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const saltBuffer = new TextEncoder().encode(salt);

  const finalKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    exportable,
    ["encrypt", "decrypt"],
  );

  return finalKey;
};

/**
 * Takes a cryptoKey and salt, runs PBKDF2 with given iterations and returns an **exportable** derived key
 * @param{CryptoKey} key
 * @param{string} salt
 * @param{number} iterations
 * @returns{Promise<CryptoKey>}
 */

export const deriveKey = async (
  key: CryptoKey,
  salt: string,
  iterations: number,
): Promise<CryptoKey> => {
  try {
    const saltBuffer = new TextEncoder().encode(salt);
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: iterations,
        hash: "SHA-256",
      },
      key,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    return derivedKey;
  } catch (error) {
    console.error("Error deriving key:", error);
    throw error;
  }
};
