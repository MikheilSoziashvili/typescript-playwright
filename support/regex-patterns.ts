export const twoDigitDecimalWithX = /[0-9]{1,2}\.[0-9]{1,2}[x]/;
export const twoDigitDecimalWithS = /[0-9]{1,2}\.[0-9]{1,2}[s]/;
export const plusSignWithDecimalCurrency = /\+.+\d.+/;
export const decimalNumber = /\.*[1-9]+[\.\,][0-9]+[\.\,]?[0-9]+\.*/;
export const plusSignWithExactDecimalCurrency = (decimalString: string) => {
	let decimalStringEscaped: string = decimalString.replace(/\./g, "\\.");
	decimalStringEscaped = decimalStringEscaped.replace(/,/g, "\\,");
	const regExpString: string = `\\+.+${decimalStringEscaped}`;

	return new RegExp(regExpString);
};
