import { CurrencySymbol } from "@enums/currenciesSymbols";
import { TestTag } from "@enums/test-tags";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

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
export const currencyToNumberWithSuffixPattern = /[^\d.kmb]/gi;
export const currencyOnlyPattern = /[^0-9.,\s]/g;
export const betLabelPattern = /^Bet/i;
export const urlSpecialCharactersPattern = /[^a-z0-9\s-_]/g;
export const urlSpacesAndUnderscoresPattern = /[\s_]+/g;
export const urlMultipleHyphensPattern = /-+/g;
export const urlLeadingTrailingHyphensPattern = /^-|-$/g;
export const quotesRemovalPattern = /['"]/g;
export const plainAmount = /^\d+(\.\d{2})?$/;
export const shortScaled = /^\d+(\.\d{1,2})?[kmbKMB]$/;
export const nonAlphanumSpacePattern = /[^a-zA-Z0-9 ]/g;
export const rewardedUserIdPattern = /Successfully rewarded user\s*#(\d+)/g;

export const wickedGamesHostPattern = /tequity\.staging\.wicked\.games$/i;
export const wickedGamesAuthPathPattern = /\/authenticate(?:\?.*)?$/i;
export const aleaPlayHostPattern = /play\.aleaplay\.com$/i;
export const aleaPlayAuthPathPattern = /\/api\/v1\/games\/\d+(?:\?.*)?$/i;
export const sessionIdPattern = /\.([a-z0-9]{8})-/i;
/* eslint-disable no-control-regex */
// Added regex to avoid external library dependency
export const ansiEscapePattern = /\x1b\[[0-9;]*m/g;
export const newlinePattern = /\n/g;
export const carriageReturnPattern = /\r/g;
export const multipleSpacesPattern = /\s+/g;
export const nonPrintableCharsPattern = /[^\x20-\x7E]/g;
export const backslashPattern = /\\/g;
export const doubleQuotePattern = /"/g;
export const windowsLineEndingPattern = /\r\n/g;
export const trailingHashPattern = /#$/;
export const testTimeoutPattern = /Test timeout of (\d+)ms exceeded/;

export const normalizeDropdownValue = (value: string): string =>
	value.replace(/\s+/g, "");

export const dropdownNormalizedPattern = (value: string): RegExp =>
	new RegExp(normalizeDropdownValue(value), "i");

export const sequentialTestPattern = new RegExp(
	`${TestTag.SEQUENTIAL}(?!-)`,
	"i",
);
export const sequentialParallelTestPattern = new RegExp(
	TestTag.SEQUENTIAL_PARALLEL,
	"i",
);
export const escapedNewlinePattern = /\\n/g;

export const classNamePattern = (attributeValue: string): RegExp =>
	new RegExp(`\\b${attributeValue}\\b`);

export const jiraIssuePattern = /\[([A-Z]+-\d+)\]/;
export const jiraIssueGlobalPattern = /\[([A-Z]+-\d+)\]/g;
export const tagPrefixPattern = /^@/;

export const freeSpinsMessagePattern = (expectedSpins: number): RegExp =>
	new RegExp(`You have ${expectedSpins} spin(s)?`, "i");
export const regexSpecialCharsPattern = /[.*+?^${}()|[\]\\]/g;
export const escapeRegexSpecialChars = (text: string): string =>
	text.replace(regexSpecialCharsPattern, "\\$&");

export const selfExclusionTimerPattern = (days: SelfExclusionDays): RegExp => {
	switch (days) {
		case SelfExclusionDays.ONE_DAY:
			return /^0d\s+23h\s+59m\s+\d{1,2}s$/;
		case SelfExclusionDays.FIVE_DAYS:
			return /^4d\s+23h\s+59m\s+\d{1,2}s$/;
		case SelfExclusionDays.EIGHT_DAYS:
			return /^7d\s+23h\s+59m\s+\d{1,2}s$/;
		default:
			return /^\d+d\s+\d{1,2}h\s+\d{1,2}m\s+\d{1,2}s$/;
	}
};
export const numericAmountPattern = /[\d,.]+/;
export const shortScaledAmountPattern = /[\d,.]+[kmbKMB]/;
export const urlTokenPattern = /[?&]token=([^&"\s]+)/;
export const htmlHrefLinkPattern = /href="(https?:\/\/[^"]+)"/g;

// Game tile item test id format example:
// lobby-carousel-item-0-container-barrel-bonanza-alea15315
// Captures the game name (e.g. "barrel-bonanza") from the data-testid.
export const gameNameFromTestIdPattern = /\bcontainer-([a-z0-9-]+)-[^-]+$/i;
