import type { Record } from "./Record";

/**
 * Interface for a Note type of record
 */
export interface Note extends Record {
  /**
   * Residual field, only purpose is to differentiate from Record, use Record's Note for storing data. Don't use this for anything
   */
  meta: null;
}
