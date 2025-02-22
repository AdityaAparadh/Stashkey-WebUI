import { describe, expect, it } from "vitest";
import { createKey } from "../utils/Key";
import { getDecryptedDataFromBlob, getEncryptedBlobAndIV } from "../utils/Blob";

describe("Blob", () => {
  it("It should take json, encrypt and decrypt it correctly", async () => {
    const key = await createKey("password", "salt", 10);

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
    const key = await createKey("password", "salt", 10);
    const data = {};

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });

  it("It should handle large data correctly", async () => {
    const key = await createKey("password", "salt", 10);
    const data = { text: "a".repeat(10000) };

    const { blob, iv } = await getEncryptedBlobAndIV(data, key);
    const decryptedData = await getDecryptedDataFromBlob(blob, iv, key);

    expect(decryptedData).toStrictEqual(data);
  });
});
