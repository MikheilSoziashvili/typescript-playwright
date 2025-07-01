import { NullableString, NullableDateString } from "@core/types/types";

export interface AmlStatusInsertOptions {
  userId: number;
  lvl1Reason?: NullableString;
  lvl2Reason?: NullableString;
  lvl3Reason?: NullableString;
  lvl1Status?: NullableString;
  lvl2Status?: NullableString;
  lvl3Status?: NullableString;
  lvl1Date?: NullableDateString;
  lvl2Date?: NullableDateString;
  lvl3Date?: NullableDateString;
  lvl1ActionDate?: NullableDateString;
  lvl2ActionDate?: NullableDateString;
  lvl3ActionDate?: NullableDateString;
  sixDigits?: NullableString;
  sixDigitsCreationDate?: NullableDateString;
  modifiedDate?: NullableDateString;
  hasLogMessage?: boolean;
}