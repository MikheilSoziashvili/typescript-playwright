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

export const usernamePattern = /[^A-Za-z0-9]/g;
export const sanitizeTitlePattern = /[^a-zA-Z0-9]/g;
export const passwordPattern = /[A-Za-z0-9!@#$%^]+/;
export const otpAuthSecretPattern =
	/otpauth:\/\/totp\/[^?]+\?secret=([A-Z0-9]+)/;
export const lowerToUpperWithSpace = /([a-z])([A-Z])/g;
export const capitalizeFirstLetter = /^./;
