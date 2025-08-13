import { CurrencySymbol } from "@enums/currenciesSymbols";

export const twoDigitDecimalWithX = /[0-9]{1,2}\.[0-9]{1,2}[x]/;
export const twoDigitDecimalWithS = /[0-9]{1,2}\.[0-9]{1,2}[s]/;
export const plusSignWithDecimalCurrency = /\+.+\d.+/;
export const decimalNumber = /\.*[0-9]+[.,][0-9]+[.,]?[0-9]+\.*/;
export const pageUrl = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i;
export const plusSignWithExactDecimalCurrency = (
	decimalString: string,
): RegExp => {
	let decimalStringEscaped: string = decimalString.replace(/\./g, "\\.");
	decimalStringEscaped = decimalStringEscaped.replace(/,/g, "\\,");
	const regExpString = `\\+.+${decimalStringEscaped}`;

	return new RegExp(regExpString);
};

export const sanitizeTitlePattern = /[^a-zA-Z0-9]/g;
export const passwordPattern = /[A-Za-z0-9!@#$%^]+/;
export const otpAuthSecretPattern =
	/otpauth:\/\/totp\/[^?]+\?secret=([A-Z0-9]+)/;
export const lowerToUpperWithSpace = /([a-z])([A-Z])/g;
export const capitalizeFirstLetter = /^./;
export const whiteSpacePattern = /\s+/g;
export const wwwPattern = /www\./;
export const sanitizeAmount = /[^0-9.]/g;
export const digitsOnlyPattern = /\d+/;
export const emailDomainPattern = /@.*$/;
export const currencyAmountPattern = (
	currencySymbol = CurrencySymbol.USD,
): RegExp =>
	new RegExp(`^\\${currencySymbol}\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$`);

export const currencyToNumberPattern = /[^\d.-]/g;
export const currencyOnlyPattern = /[^0-9.,\s]/g;
export const urlSpecialCharactersPattern = /[^a-z0-9\s-_]/g;
export const urlSpacesAndUnderscoresPattern = /[\s_]+/g;
export const urlMultipleHyphensPattern = /-+/g;
export const urlLeadingTrailingHyphensPattern = /^-|-$/g;
export const plainAmount = /^\d+(\.\d{2})?$/;
export const shortScaled = /^\d+(\.\d{1,2})?[kmbKMB]$/;