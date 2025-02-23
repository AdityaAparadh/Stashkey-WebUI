import { Record } from "./Record";

/**
 * Enum to store various Payment Card Networks
 */
export enum CardType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
  DINERS = "DINERS",
  JCB = "JCB",
  RUPAY = "RUPAY",
  OTHERS = "OTHERS",
}

/**
 * Enum to store months, specifically for Card info
 */
export enum MonthType {
  JAN = 1,
  FEB = 2,
  MAR = 3,
  APR = 4,
  MAY = 5,
  JUN = 6,
  JUL = 7,
  AUG = 8,
  SEP = 9,
  OCT = 10,
  NOV = 11,
  DEC = 12,
}

/**
 * Interface to store Payment Card information
 */
export interface Card extends Record {
  /**
   * The 12/16 digit card number
   */
  cardNumber: string;

  /**
   * The card holder's name ( as on the card)
   */
  cardHolder: string;

  /**
   * The month of expiration of card
   */
  expirationMonth: MonthType;

  /**
   * The last two digits of expiration year of the card
   */
  expirationYear: number;

  /**
   * The CVV of the card
   */
  cvv: number;

  /**
   * The payment network of the card, defined in above enum
   */
  cardType: CardType;

  /**
   * The main code/PIN used to make payments
   */
  securityCode: string;
}
