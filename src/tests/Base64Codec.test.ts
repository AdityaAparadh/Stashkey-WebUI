import { describe, it, expect } from "vitest";
import { arrayBufferToBase64, base64ToArrayBuffer } from "../utils/Base64";

describe("Base64Codec", () => {
  it("It should encode and decode successfully", () => {
    const buffer = new ArrayBuffer(5000010);
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new_buffer.byteLength).toBe(5000010);
  });
});

describe("Base64Codec", () => {
  it("It should encode and decode successfully", () => {
    const buffer = new ArrayBuffer(0);
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new_buffer.byteLength).toBe(0);
  });
});

describe("Base64Codec", () => {
  it("It should encode and decode successfully", () => {
    const buffer = new ArrayBuffer(10);
    const view = new Uint8Array(buffer);
    for (let i = 1; i <= 10; i++) {
      view[i] = i;
    }
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new_buffer).toStrictEqual(buffer);
  });
});

describe("Base64Codec", () => {
  it("Should handle UTF-8 strings correctly", () => {
    const str = "Hello 👋 World! 🌍";
    const buffer = new TextEncoder().encode(str).buffer;
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    const decoded = new TextDecoder().decode(new_buffer);
    expect(decoded).toBe(str);
  });
});

describe("Base64Codec", () => {
  it("Should handle binary data with zeros", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view.set([0, 255, 0, 128, 64, 0, 32, 16]);
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new Uint8Array(new_buffer)).toStrictEqual(view);
  });
});

describe("Base64Codec", () => {
  it("Should handle random data", () => {
    const buffer = new ArrayBuffer(10);
    const view = new Uint8Array(buffer);
    crypto.getRandomValues(view);
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new_buffer).toStrictEqual(buffer);
  });
});

describe("Base64Codec", () => {
  it("Should handle large random data", () => {
    const buffer = new ArrayBuffer(65536);
    const view = new Uint8Array(buffer);
    crypto.getRandomValues(view);
    const new_buffer = base64ToArrayBuffer(arrayBufferToBase64(buffer));
    expect(new_buffer).toStrictEqual(buffer);
  });
});
