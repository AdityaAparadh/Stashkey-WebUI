/**
 * Enum for different types of records in the vault
 */
export enum RecordType {
  LOGIN = "LOGIN",
  IDENTITY = "IDENTITY",
  CARD = "CARD",
  NOTE = "NOTE",
}

/**
 * Interface for various types of records, containing common elements like uuid and notes
 */
export interface Record {
  /**
   * A unique id for each record
   */
  uuid: string;

  /**
   * The type of record
   */
  recordType: RecordType;

  /**
   * Date at which record was first created
   */
  createdAt: Date;

  /**
   * Date at which record was last modified
   */
  modifiedAt: Date;

  /**
   * Any notes to be stored with each record
   */
  notes: string;
}
