import { describe, expect, it } from "vitest";
import { createKey } from "../utils/Key";
import { getDecryptedDataFromBlob, getEncryptedBlobAndIV } from "../utils/Blob";

describe("Blob", () => {
  it("It should take json, encrypt and decrypt it correctly", async () => {
    const key = await createKey("password", "salt", 10, true);

    const data = {
      username: "geralt",
      password: "password",
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });
});

describe("Blob Encryption and Decryption", () => {
  it("It should handle empty data correctly", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {};

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("It should handle large data correctly", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = { text: "a".repeat(10000) };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });
});

describe("Blob Advanced Tests", () => {
  it("Should handle nested objects correctly", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      user: {
        profile: {
          name: "Geralt",
          occupation: "Witcher",
          details: {
            age: 100,
            skills: ["sword", "magic", "gwent"],
          },
        },
      },
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("Should handle arrays correctly", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      items: [1, 2, 3, 4, 5],
      inventory: ["sword", "potion", "armor"],
      mixed: [{ id: 1 }, { id: 2 }, null, undefined, 42],
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("Should handle special characters in data", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      special: "!@#$%^&*()_+-=[]{}|;:'\",.<>?/\\",
      emoji: "🦊🌟🎮🎲",
      unicode: "こんにちは世界",
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("Should handle null and undefined values", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      nullValue: null,
      undefinedValue: undefined,
      nested: {
        nullInside: null,
        undefinedInside: undefined,
      },
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("Should produce different blobs for same data with different keys", async () => {
    const key1 = await createKey("password1", "salt1", 10, true);
    const key2 = await createKey("password2", "salt2", 10, true);
    const data = { message: "secret" };

    const { blob: blob1 } = await getEncryptedBlobAndIV(data, key1);
    const { blob: blob2 } = await getEncryptedBlobAndIV(data, key2);

    expect(blob1).not.toBe(blob2);
  });

  it("Should handle numbers and booleans correctly", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      integer: 42,
      float: 3.14159,
      negative: -123,
      boolean: true,
      zero: 0,
      scientific: 1e-10,
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("Should handle edge case of maximum safe integer", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = {
      maxInt: Number.MAX_SAFE_INTEGER,
      minInt: Number.MIN_SAFE_INTEGER,
    };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });
});

describe("Error Handling", () => {
  it("Should reject with invalid key", async () => {
    const key = await createKey("password", "salt", 10, true);
    const invalidKey = new Uint8Array(32); // Zero-filled key
    const data = { message: "test" };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);

    await expect(
      getDecryptedDataFromBlob(blob, iv, invalidKey),
    ).rejects.toThrow();
  });

  it("Should reject with invalid IV", async () => {
    const key = await createKey("password", "salt", 10, true);
    const data = { message: "test" };
    const invalidIV = new Uint8Array(12); // Zero-filled IV

    const { blob } = await getEncryptedBlobAndIV(data, key);

    await expect(
      getDecryptedDataFromBlob(blob, invalidIV, key),
    ).rejects.toThrow();
  });
});
