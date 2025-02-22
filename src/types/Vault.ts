import { Record } from "./Record";

/**
 * Interface for the global vault object, which contains all the user's data
 */
export interface Vault {
  username: string;
  lastModifier: Date;
  publicKey: string;
  privateKey: string;
  vaultData: [Record] | null;
}
