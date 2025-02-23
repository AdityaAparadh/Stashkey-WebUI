import { Record } from "./Record";
/**
 * Interface to store identity info about the user ( self explanatory fields)
 */
export interface Identity extends Record {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
