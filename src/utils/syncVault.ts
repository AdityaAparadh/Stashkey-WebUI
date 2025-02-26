import { Vault } from "@/types/Vault";
import { getEncryptedBlobAndIV } from "./Blob";
import config from "@/config";
import axios from "axios";

/**
 *
 * @param{Vault} vault The Vault object to be sent
 * @param{CryptoKey} encryptionKey The encryption key to encrypt the vault
 * @param{string} token The JWT token to be sent in the Authorization header
 * @returns{boolean} True if update succeeds, else false
 */
const syncVault = async (
  vault: Vault,
  encryptionKey: CryptoKey,
  token: string,
): Promise<boolean> => {
  try {
    const { blob, iv } = await getEncryptedBlobAndIV(vault, encryptionKey);
    const formData: FormData = new FormData();
    formData.append("username", vault.username);
    formData.append("iv", iv);
    formData.append("vault", blob);

    await axios.post(`${config.BACKEND_URI}/vault/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return true;
  } catch (err) {
    console.error("AN ERROR OCCURED IN UPDATE VAULT");
    console.error(err);
    return false;
  }
};
export default syncVault;
