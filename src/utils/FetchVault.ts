import axios from "axios";
import config from "../config";

/**
 * Fetches and returns the vault as encrypted blob and IV
 * @param username
 * @param token
 * @returns Encrypted Blob and IV as an object
 */
export const fetchVault = async (
  username: string,
  token: string,
): Promise<{ blob: Blob | null; iv: string | null }> => {
  try {
    const res = await axios.post(
      `${config.BACKEND_URI}/vault/fetch`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const url: string = res.data.vault_url;
    const iv: string = res.data.iv;

    if (!url || !iv) {
      throw new Error("Missing vault_url or iv in response");
    }

    const blobRes = await axios.get(url, {
      responseType: "blob",
    });

    console.log("Blob response status:", blobRes.status);

    const blob = new Blob([blobRes.data], { type: "application/octet-stream" });
    console.log("Constructed BLOB:", blob);

    return { blob, iv };
  } catch (err) {
    console.error("Error in fetchVault:", err);
    if (axios.isAxiosError(err) && err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
    }

    return { blob: null, iv: null };
  }
};
