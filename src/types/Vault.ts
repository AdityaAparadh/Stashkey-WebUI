import { Record } from "./Record";

/**
 * Interface for the global vault object, which contains all the user's data
 */
export interface Vault {
  /**
   * The username of the user
   */
  username: string;

  /**
   * Timestamp of the Last write to the vault
   */
  lastModified: Date;

  /**
   * The public key of the user, reserved for future use
   */
  publicKey: string;

  /**
   * Corresponding private key to the public key
   */
  privateKey: string;

  /**
   * Actual vault data, an array containing elements of type Record
   */
  vaultData: Record[] | null;
}
