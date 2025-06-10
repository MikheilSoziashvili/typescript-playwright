import { format } from "date-fns";
import * as path from "path";
import { GamdomApi } from "@api/gamdom-api";
import { DEFAULT_CURRENCY } from "@constants/defaults";
import { MAILINATOR_DOMAIN } from "@constants/domains";
import { AUTH_PATH } from "@constants/file-paths";
import { JsonData, WaitUntilOptions } from "@core/interfaces";
import {
	CalculateMinesMultiplierArgs,
	CredentialsType,
	ProxyCredentialsType,
	TestUserConfigurationObject,
} from "@core/types/types";
import { RegisterTestData } from "@dtos/test-data";
import { Protocol } from "@enums/api/protocols";
import { ConfiguraitonUrl } from "@enums/configuration-urls";
import { Currency } from "@enums/currencies";
import { UserTags } from "@enums/db/user-tags";
import { Locale } from "@enums/locale";
import { DocumentReadyState } from "@enums/playwright/document-ready-states";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import {
	otpAuthSecretPattern,
	pageUrl,
	sanitizeTitlePattern,
	wwwPattern,
} from "@support/regex-patterns";
import accounting from "accounting";
import { environment_url, users } from "configuration";
import { parse } from "csv-parse/sync";
import fs, { promises as fsPromises, readFileSync } from "fs";
import jsQR from "jsqr";
import { authenticator } from "otplib";
import { Browser, BrowserContext, Cookie, Locator, Page } from "playwright";
import { PNG, PNGOptions } from "pngjs";
import sharp from "sharp";
import xml2js from "xml2js";
import { CurrencySymbol } from "@enums/currenciesSymbols";
import { NumberSeparators } from "@enums/number-separators";

export function encodeCredentials(username: string, password: string): string {
	const credentials = `${username}:${password}`;
	return Buffer.from(credentials).toString("base64");
}

export async function readFromJSONFile(filePath: string): Promise<JsonData> {
	const fileContents: string = await fsPromises.readFile(filePath, "utf-8");
	return JSON.parse(fileContents) as JsonData;
}

export async function writeToJSONFile(
	data: object,
	filePath: string,
): Promise<void> {
	try {
		const existingData = JSON.parse(
			await fsPromises.readFile(filePath, "utf-8"),
		) as object;
		await fsPromises.writeFile(
			filePath,
			JSON.stringify({ ...existingData, ...data }, null, 4),
		);
	} catch (error) {
		logger.error("Error writing to JSON file:", error);
		throw error;
	}
}

export async function prependXmlHeaderToFile(
	filePath: string,
): Promise<string> {
	const xmlContent = await fsPromises.readFile(filePath, "utf-8");
	return '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlContent;
}

export async function parseXmlFile<T>(filePath: string): Promise<T> {
	if (!fs.existsSync(filePath)) {
		throw new Error(`File not found: ${filePath}`);
	}

	const xmlContent = fs.readFileSync(filePath, { encoding: "utf8" });
	const parser = new xml2js.Parser();
	const result = (await parser.parseStringPromise(xmlContent)) as T;

	return result;
}

export function jiraIssueId(id: number | string, key = "ENG"): string {
	return `${ConfiguraitonUrl.JIRA}/browse/${key}-${id}`;
}

export async function clearDirectoryContent(
	directory: string,
	exclude: string[] = [],
): Promise<void> {
	try {
		const files = await fsPromises.readdir(directory);
		const filesToDelete = files.filter((file) => !exclude.includes(file));

		await Promise.all(
			filesToDelete.map((file) =>
				fsPromises.unlink(`${directory}/${file}`),
			),
		);
	} catch (err) {
		logger.error(err);
	}
}

export function getFilePath(
	filename: string,
	baseDir: string = __dirname,
): string {
	return path.join(baseDir, filename);
}

/**
 * Parses a CSV file and returns its content.
 *
 * This function reads a CSV file from the specified path, optionally parsing it into columns.
 * The last argument can be an options object to configure the CSV parsing.
 * @param {...(string | { columns?: boolean })[]} args - The arguments to specify the file path and options.
 *   - Strings: Parts of the file path relative to the project root.
 *   - Object (optional): Configuration options for parsing:
 *     - `columns` (boolean): Whether to parse the CSV content into columns. Defaults to `true`.
 * @returns {unknown} The parsed CSV content.
 * @example
 * // Parse a CSV file with default options (columns: true)
 * const data = parse_csv("data", "file.csv");
 * @example
 * // Parse a CSV file without columns
 * const data = parse_csv("data", "file.csv", { columns: false });
 */
export function parse_csv(
	...args: (string | { columns?: boolean })[]
): unknown {
	const options =
		typeof args[args.length - 1] === "object"
			? (args.pop() as { columns?: boolean })
			: { columns: true };

	const filePath = path.resolve(__dirname, "../..", ...(args as string[]));
	const csvFile = readFileSync(filePath);

	return parse(csvFile, {
		columns: options.columns,
		skip_empty_lines: true,
	});
}

export function toJson(obj: object, indent = 4): string {
	return JSON.stringify(obj, null, indent);
}

export function findUser(
	options: Partial<TestUserConfigurationObject>,
): TestUserConfigurationObject | undefined {
	return users.find((user) =>
		Object.entries(options).every(
			([key, value]) =>
				key in user &&
				user[key as keyof TestUserConfigurationObject] === value,
		),
	);
}

export function parseBalance(rawValue: string): number {
	return accounting.unformat(rawValue);
}

export function formatBalance(
	value: number,
	symbol: CurrencySymbol.USD,
	precision = 2,
	thousand: NumberSeparators.THOUSAND,
	decimal: NumberSeparators.DECIMAL,
): string {
	return accounting.formatMoney(value, {
		symbol,
		precision,
		thousand,
		decimal,
	});
}

/**
 * Formats a number into a localized currency string.
 *
 * This utility wraps `Intl.NumberFormat` to format amounts based on locale and currency.
 *
 * @param {number} amount - The numeric value to format.
 * @param {string} [locale='en-US'] - The locale code (e.g., 'en-US', 'de-DE').
 * @param {string} [currency='USD'] - The currency code (e.g., 'USD', 'EUR').
 * @param {number} [minimumFractionDigits=2] - The minimum number of fraction digits to display.
 * @returns {string} The formatted currency string.
 *
 * @example
 * formatCurrency(5000); // "$5,000.00"
 * formatCurrency(500000); // "$500,000.00"
 */
export function formatCurrency(
	amount: number,
	locale: Locale = Locale.EN_US,
	currency: Currency = Currency.USD,
	minimumFractionDigits = 2,
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
		minimumFractionDigits: minimumFractionDigits,
	}).format(amount);
}

export function parseMultiplier(rawValue: string): number {
	return Number(rawValue.replace("x", ""));
}

export function range(start: number, stop: number, step = 1): number[] {
	return [...Array(stop - start).keys()]
		.filter((i) => !(i % Math.round(step)))
		.map((v) => start + v);
}

export function roundToDecimals(value: number, decimals = 5): number {
	return parseFloat(value.toFixed(decimals));
}

export function parseToFloat(num: number, fractionDigits = 2): string {
	return parseFloat(`${num}`).toFixed(fractionDigits);
}

export function truncateToDecimals(value: number, decimals = 1): number {
	const factor = Math.pow(10, decimals);
	return Math.floor(value * factor) / factor;
}

export function generateRandomString(options?: {
	prefix?: string;
	length?: number;
}): string {
	const length = options?.length || 4;
	const randomString = Array(length)
		.fill(0)
		.map(() => (~~(Math.random() * 36)).toString(36))
		.join("");

	return options?.prefix ? `${options.prefix}${randomString}` : randomString;
}

export const getRandomPhone = (countryCode = "+1", length = 9): string => {
	const formattedCountryCode = countryCode.startsWith("+")
		? countryCode
		: `+${countryCode}`;

	const characters = "0123456789";
	const randomNumbers = Array.from({ length }, () =>
		characters.charAt(Math.floor(Math.random() * characters.length)),
	).join("");

	return `${formattedCountryCode}${randomNumbers}`;
};

export const getRandomEmail = (): string =>
	`gamdom-e2e-email${Date.now()}@gmail.com`;

export const getRandomNumber = (length: number): number => {
	const characters = "123456789";
	let number = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		number += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
	}
	return parseInt(number, 10);
};

export function getRegisterDataRandomUsernameWithPrefix(
	usernamePrefix: string,
): RegisterTestData {
	return new RegisterTestData({
		username: generateRandomString({ prefix: usernamePrefix }),
	});
}

export function asString(str: string | undefined): string {
	return str as string;
}

export function buildAmountWithCurrency(
	amount: number,
	currency = DEFAULT_CURRENCY,
): string {
	const amountWithCurrency = `${currency}${parseToFloat(amount)}`;

	return amountWithCurrency;
}

export function conformLinkWithProtocol(
	link: string,
	protocol: Protocol,
): string {
	let conformedLink = link;
	const urlPattern = pageUrl;
	if (!urlPattern.test(conformedLink)) {
		conformedLink = `${protocol}://${link}`;
	}
	return conformedLink;
}

export function normalizeUrl(url: string): string {
	return url.replace(wwwPattern, "");
}

export function generateEmailAndInbox(): { email: string; inbox: string } {
	const email = `${generateRandomString({
		prefix: "gmdverify",
		length: 10,
	})}@${MAILINATOR_DOMAIN}`;
	const inbox = email.split("@")[0];

	return { email, inbox };
}

/**
 * Constructs a URL endpoint by joining multiple paths, replacing path parameters, and appending query parameters.
 *
 * @param {Object} parameters - An object containing the paths, path parameters, and query parameters.
 * @param {string[]} parameters.paths - An array of path segments to be joined together to form the base path.
 * @param {Record<string, string>} [parameters.pathParams] - An optional object where keys correspond to placeholders in the paths (e.g., `:userId`), and values are used to replace these placeholders.
 * @param {Record<string, string | string[]>} [parameters.queryParams] - An optional object containing query parameters to be appended to the endpoint. If a value is an array, multiple query parameters with the same key will be added.
 *
 * @returns {string} The constructed endpoint URL as a string, with paths joined, path parameters replaced, and query parameters appended.
 *
 * @example
 * // Example 1: Simple path with query params
 * const endpoint = buildEndpoint({
 *   paths: ["/api", "/users"],
 *   queryParams: { status: "active" }
 * });
 * // Output: "/api/users?status=active"
 *
 * @example
 * // Example 2: Path with dynamic path parameters and query params
 * const endpoint = buildEndpoint({
 *   paths: ["/api", "/users", ":userId", "orders"],
 *   pathParams: { userId: "123" },
 *   queryParams: { status: "shipped" }
 * });
 * // Output: "/api/users/123/orders?status=shipped"
 *
 * @example
 * // Example 3: Multiple query params with array values
 * const endpoint = buildEndpoint({
 *   paths: ["/api", "/users"],
 *   queryParams: { filter: ["active", "premium"] }
 * });
 * // Output: "/api/users?filter=active&filter=premium"
 */
export function buildEndpoint(parameters: {
	paths: string[];
	pathParams?: Record<string, string>;
	queryParams?: Record<string, string | string[]>;
}): string {
	const fullPath = parameters.paths.join("/");
	let path = fullPath;
	if (parameters.pathParams) {
		for (const [key, value] of Object.entries(parameters.pathParams)) {
			path = path.replace(`:${key}`, value);
		}
	}
	let endpoint = path;
	if (parameters.queryParams) {
		const queryParams = new URLSearchParams();
		for (const [key, value] of Object.entries(parameters.queryParams)) {
			if (Array.isArray(value)) {
				value.forEach((v) => queryParams.append(key, v));
			} else {
				queryParams.append(key, value);
			}
		}
		endpoint += `?${queryParams.toString()}`;
	}

	return endpoint;
}
export function createAuthCookie(setCookie: string): {
	name: string;
	value: string;
	domain: string;
	path: string;
	httpOnly: boolean;
	secure: boolean;
}[] {
	const domain = environment_url.split("://")[1];
	return [
		{
			name: getCookieName(setCookie),
			value: getCookieValue(setCookie),
			domain: domain,
			path: "/",
			httpOnly: true,
			secure: false,
		},
	];
}

export async function setAuthenticationCookies(
	page: Page,
	setCookie: string,
): Promise<void> {
	await page.context().addCookies(createAuthCookie(setCookie));
}

export async function setContextAuthenticationCookies(
	context: BrowserContext,
	setCookie: string,
): Promise<void> {
	await context.addCookies(createAuthCookie(setCookie));
}

export function getCookieName(setCookie: string): string {
	return setCookie.split("=")[0];
}

export function getCookieValue(setCookie: string): string {
	return setCookie.split("=")[1].split(";")[0];
}

export function getCookieHeader(setCookie: string): string {
	return setCookie.split(";")[0];
}

export function throwError(error: unknown, message: string): never {
	if (error instanceof Error) {
		throw new Error(`${message}: ${error.message}`);
	}
	throw new Error(message);
}

export const getUserDetailsByTestTitle = (
	testInfoTitle: string,
	workerIndex: number,
): CredentialsType => {
	const sanitizedTitle = testInfoTitle.replace(sanitizeTitlePattern, "_");
	const storageStatePath = path.join(
		process.cwd(),
		AUTH_PATH,
		`${sanitizedTitle}_worker${workerIndex}.json`,
	);

	const data = JSON.parse(
		fs.readFileSync(storageStatePath, "utf-8"),
	) as CredentialsType;
	return data;
};

export const writeUserDetails = (
	testInfoTitle: string,
	workerIndex: number,
	userDetails: { username: string; password: string; email?: string },
): void => {
	const sanitizedTitle = testInfoTitle.replace(sanitizeTitlePattern, "_");
	const filePath = path.join(
		process.cwd(),
		AUTH_PATH,
		`${sanitizedTitle}_worker${workerIndex}.json`,
	);

	fs.writeFileSync(filePath, JSON.stringify(userDetails, null, 2), "utf-8");
};

/**
 * Generates a unique file path for a PNG image in the 'testImages' directory.
 *
 * The function ensures that the 'testImages' directory exists. If the directory does not exist,
 * it creates one. It then generates a random PNG image file name with a 'dummy-image-' prefix
 * and a random 5-character suffix, and returns the full path for where the image would be stored.
 *
 * @returns {string} The full file path for the generated PNG image.
 *
 * @example
 * const imagePath = getPngImagePath();
 * console.log(imagePath); // './testImages/dummy-image-abc12.png'
 */
export function createPngImagePath(): string {
	const dirPath = ensureTestImagesDir();
	const fileName = `${generateRandomString({
		prefix: "e2e-test-image-",
		length: 5,
	})}.png`;
	const filePath = path.join(dirPath, fileName);

	logger.info(`Generated PNG image path: ${filePath}`);
	return filePath;
}

function ensureTestImagesDir(): string {
	const dirPath = path.join("./", "testImages");
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
		logger.info(`Directory created: ${dirPath}`);
	}
	return dirPath;
}

export async function createDummyPngImage(): Promise<string> {
	const dirPath = ensureTestImagesDir();
	const fileName = `${generateRandomString({
		prefix: "dummy-image-",
		length: 5,
	})}.png`;
	const filePath = path.join(dirPath, fileName);
	const pngOptions: PNGOptions = { width: 200, height: 200 };
	const png = new PNG(pngOptions);

	// Set default color to blue (RGBA: 0, 0, 255, 255)
	const defaultColor = { r: 0, g: 0, b: 255, a: 255 };

	// Fill the image with the specified default color
	for (let y = 0; y < png.height; y++) {
		for (let x = 0; x < png.width; x++) {
			const idx = (png.width * y + x) << 2;
			png.data[idx] = defaultColor.r;
			png.data[idx + 1] = defaultColor.g;
			png.data[idx + 2] = defaultColor.b;
			png.data[idx + 3] = defaultColor.a;
		}
	}

	return new Promise((resolve, reject) => {
		png.pack()
			.pipe(fs.createWriteStream(filePath))
			.on("finish", () => {
				logger.info(`Dummy PNG file created at: ${filePath}`);
				resolve(filePath);
			})
			.on("error", (err) => {
				logger.error("Error writing PNG file:", err);
				reject(err);
			});
	});
}

export async function isElementVisible(locator: Locator): Promise<boolean> {
	const box = await locator.boundingBox();
	return box !== null && box.x > 300 && box.height > 0;
}

export async function deleteFilesWithFilePaths(
	filePaths: string[],
): Promise<void> {
	filePaths.forEach((filePath) => {
		fs.unlink(filePath, (err) => {
			if (err) {
				logger.error(`Error deleting file ${filePath}:`, err);
			} else {
				logger.info(`File deleted: ${filePath}`);
			}
		});
	});
}

/**
 * Generates a 2FA code using the provided TOTP secret and custom expiration time.
 *
 * @param {string} secret - The TOTP secret used to generate the code.
 * @returns {Promise<string>} A promise that resolves to the generated 2FA code.
 * @throws {Error} If there's an error generating the code.
 */
export async function generate2FACodeFromSecret(
	secret: string,
): Promise<string> {
	try {
		authenticator.resetOptions();
		authenticator.options = {
			step: 30, // 30-second time step (standard for TOTP)
			window: 1, // Allow previous and current time steps
		};

		const code = authenticator.generate(secret); // Use authenticator from otplib
		if (!code) {
			throw new Error(
				"Failed to generate 2FA code using otpAuth from otplib.",
			);
		}
		logger.info(`Generated 2FA code: ${code}`);
		return code;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		throw new Error(
			`Error while generating 2FA code with otpAuth: ${errorMessage}`,
		);
	}
}

/**
 * Extracts the secret from a QR code contained in an image.
 *
 * This function reads an image file, processes it to identify a QR code,
 * and extracts the 'secret' parameter from the otpauth URL format if found.
 *
 * @param {string} imagePath - The path to the image file containing the QR code.
 * @returns {Promise<string>} The extracted secret.
 * @throws {Error} If there is an error during the extraction process, such as:
 * - No QR code found in the image.
 * - No secret found in the QR code data.
 * - Any other errors during processing the image.
 */
export async function extractSecretFromQRCode(
	imagePath: string,
): Promise<string> {
	try {
		const { data, info } = await sharp(imagePath)
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });
		const rgbaValues = new Uint8ClampedArray(data.buffer);

		// Log the string version of the QR code data
		const code = jsQR(rgbaValues, info.width, info.height);
		if (!code) {
			throw new Error("No QR code found in the image.");
		}
		logger.info(`QR Code Data: ${JSON.stringify(code.data)}`);

		const match = code.data.match(otpAuthSecretPattern);

		if (match && match[1]) {
			logger.info(`Extracted Secret: ${JSON.stringify(match[1])}`);
			return match[1];
		} else {
			throw new Error("No secret found in the QR code data.");
		}
	} catch (error) {
		throw new Error(
			`Error extracting secret from QR code: ${
				error instanceof Error
					? error.message
					: "An unknown error occurred."
			}`,
		);
	}
}

/**
 * Pauses execution for a specified number of seconds.
 *
 * This utility returns a promise that resolves after a given time delay, effectively halting
 * further code execution for the specified duration.
 *
 * @param {number} seconds - The amount of time to wait, in seconds.
 * @returns {Promise<void>} A promise that resolves after the specified time delay.
 *
 * @example
 * // Wait for 3 seconds before proceeding
 * await waitForSeconds(3);
 */
export const waitForSeconds = (seconds: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, seconds * 1000);
	});

/**
 * Repeatedly checks a condition until it is satisfied or a timeout occurs.
 *
 * This utility pauses execution and continuously evaluates the provided condition
 * at specified intervals. If the condition is not met within the specified timeout duration,
 * it throws an error with a provided message.
 *
 * @param {() => boolean | Promise<boolean>} condition - A function that returns a boolean or a promise resolving to a boolean. The condition is repeatedly checked until it returns `true`.
 * @param {string} options.errorMessage - The error message to display if the condition is not met within the timeout period.
 * @param {number} [options.intervalSeconds=2] - The time interval, in seconds, between successive condition checks. Defaults to 2 seconds.
 * @param {number} [options.timeoutSeconds=Timeout.SHORT / 1000] - The maximum time to wait before throwing an error, in seconds. Defaults to `Timeout.SHORT / 1000`.
 * @returns {Promise<void>} A promise that resolves if the condition is met within the timeout period, or rejects with an error message if the timeout is reached.
 *
 * @throws {Error} If the condition is not met within the specified timeout duration, an error is thrown with the provided error message.
 *
 * @example
 * // Wait until a certain condition is true, checking every 2 seconds, with a timeout of 10 seconds
 * await waitUntil(() => someValue === expectedValue, {
 *   errorMessage: "Condition was not met within the expected time.",
 *   intervalSeconds: 2,
 *   timeoutSeconds: 10,
 * });
 */
export async function waitUntil(
	condition: () => boolean | Promise<boolean>,
	{
		errorMessage,
		intervalSeconds = 2,
		timeoutSeconds = Timeout.SHORT / 1000,
	}: WaitUntilOptions,
): Promise<void> {
	const currentTimeInSeconds = () => Date.now() / 1000;
	const [startTime, timeoutInSeconds] = [
		currentTimeInSeconds(),
		timeoutSeconds,
	];

	while (true) {
		if (await condition()) {
			return;
		}

		const elapsedTime = currentTimeInSeconds() - startTime;
		if (elapsedTime >= timeoutInSeconds) {
			throw new Error(
				`${errorMessage} - (Timeout: ${timeoutInSeconds} seconds)`,
			);
		}

		const remainingTime = timeoutInSeconds - elapsedTime;
		await waitForSeconds(Math.min(intervalSeconds, remainingTime));
	}
}

/**
 * Waits for the page to reach a specific document ready state within a specified timeout period.
 *
 * @param pageEvaluator - A function that evaluates and returns the current document ready state of the page.
 * @param targetReadyState - The desired `DocumentReadyState` to wait for (e.g., "complete", "interactive").
 * @param errorMessage - A custom error message to display if the timeout is exceeded before reaching the target state.
 * @param timeout - The maximum time (in seconds) to wait for the page to reach the target ready state.
 * @param interval - (Optional) The interval (in seconds) at which to check the page's ready state. Defaults to 0.1 seconds.
 * @returns A promise that resolves once the page reaches the target ready state or rejects if the timeout is exceeded.
 *
 * @throws Will throw an error if the ready state cannot be determined or if the specified timeout is exceeded.
 */
export async function waitForPageReadyState(
	pageEvaluator: () => Promise<string>,
	targetReadyState: DocumentReadyState,
	errorMessage: string,
	timeout: number,
	interval = 0.1,
): Promise<void> {
	await waitUntil(
		async () => {
			try {
				const readyState = await pageEvaluator();
				return readyState === targetReadyState;
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes("destroyed")
				) {
					return false;
				}
				throw error;
			}
		},
		{
			errorMessage: errorMessage,
			intervalSeconds: interval,
			timeoutSeconds: timeout,
		},
	);
}

/**
 * Retrieves the values of a specific attribute for all elements matching a locator.
 *
 * @param locator - The locator for the elements.
 * @param attribute - The attribute whose values should be retrieved.
 * @returns An array of attribute values as strings.
 */
export async function getItemsAttribute(
	locator: Locator,
	attribute: string,
): Promise<string[]> {
	const count = await locator.count();
	const attrValues: string[] = [];

	for (let i = 0; i < count; i++) {
		const value = await locator.nth(i).getAttribute(attribute);
		if (value !== null) {
			attrValues.push(value);
		}
	}

	return attrValues;
}

/**
 * Returns a formatted date string in YYYY-MM-DD format.
 * Optionally adds a specified number of days to the current date.
 *
 * @param {number} [daysToAdd=0] - The number of days to add to the current date. Defaults to 0.
 * @returns {string} The formatted date string in YYYY-MM-DD format.
 *
 * @example
 * // Get today's date
 * const today = formatDate();
 *
 * @example
 * // Get tomorrow's date
 * const tomorrow = formatDate(1);
 */
export function formatDate(daysToAdd = 0): string {
	const date = new Date();
	date.setDate(date.getDate() + daysToAdd);
	return date.toISOString().slice(0, 10);
}

/**
 * Initializes multiple page objects by associating them with a new page in the provided browser context.
 *
 * This function creates a new page within the given browser context and initializes each page object
 * by invoking its `init` method with the newly created page as an argument.
 *
 * @async
 * @param {BrowserContext} context - The browser context in which the new page will be created.
 * @param {...{ init: (page: Page) => void }[]} pageObjects - An array of page objects, each containing an `init` method
 * that accepts a `Page` instance to bind the object to the created page.
 * @returns {Promise<Page>} A promise that resolves to the newly created page.
 *
 * @example
 * // Example usage
 * const page = await initializePageObjects(context, homePage, settingsPage, walletModal);
 * await homePage.navigate();
 * await settingsPage.enable2FA();
 */
export async function initializePageObjects(
	context: BrowserContext,
	...pageObjects: { init: (page: Page) => void }[]
): Promise<Page> {
	const page = await context.newPage();
	pageObjects.forEach((obj) => obj.init(page));
	return page;
}

/**
 * Initializes multiple page objects with a new browser context that has predefined cookies.
 *
 * This function adds the provided cookies to the new browser context, closes the initial page,
 * and then initializes the given page objects within the new context.
 *
 * @async
 * @param {Cookie[]} cookies - An array of cookies to be added to the new browser context.
 * @param {Page} initialPage - The initial page instance that will be closed after cookies are set.
 * @param {BrowserContext} context - The browser context in which the new page and page objects will be initialized.
 * @param {...{ init: (page: Page) => void }[]} pageObjects - An array of page objects, each containing an `init` method
 * that accepts a `Page` instance to bind the object to the created page.
 * @returns {Promise<Page>} A promise that resolves to the newly created page with initialized page objects.
 *
 * @example
 * const newPage = await initializePageObjectsWithCookies(
 *   cookies,
 *   initialPage,
 *   context,
 *   homePage,
 *   settingsPage
 * );
 */
export async function initializePageObjectsWithCookies(
	cookies: Cookie[],
	initialPage: Page,
	context: BrowserContext,
	...pageObjects: { init: (page: Page) => void }[]
): Promise<Page> {
	await context.addCookies(cookies);
	await initialPage.close();
	return initializePageObjects(context, ...pageObjects);
}

/**
 * Creates a new browser context with a specified proxy configuration.
 *
 * This function initializes a new browser context using the provided proxy credentials.
 *
 * @async
 * @param {Browser} browser - The Playwright browser instance.
 * @param {ProxyCredentialsType} proxyCredentials - The proxy credentials used to configure the browser context.
 * @returns {Promise<BrowserContext>} A promise that resolves to the newly created browser context with the specified proxy settings.
 *
 * @example
 * const context = await createBrowserContextWithProxy(browser, NL_PROXY_CREDENTIALS);
 */
export async function createBrowserContextWithProxy(
	browser: Browser,
	proxyCredentials: ProxyCredentialsType,
): Promise<BrowserContext> {
	return browser.newContext({
		proxy: proxyCredentials,
	});
}

/**
 * Generates a 2FA code from a QR code image.
 *
 * @param {string} screenshotPath - The file path of the QR code image.
 * @returns {Promise<string>} A promise that resolves to the generated 2FA code.
 *
 * @throws {Error} If the QR code cannot be read or the secret is invalid.
 */
export async function generate2FACodeFromQRCodeImage(
	screenshotPath: string,
): Promise<string> {
	const secret = await extractSecretFromQRCode(screenshotPath);
	const code2FA = await generate2FACodeFromSecret(secret);

	return code2FA;
}

/**
 * Intercepts all network requests matching the specified host pattern and removes
 * a specific request header (e.g., "authorization") before allowing the request to continue.
 *
 * This is useful when certain third-party services (like Intercom) fail if specific headers
 * are included due to CORS or security restrictions.
 *
 * @param page - The Playwright Page object where the route interception will be applied.
 * @param hostPattern - A string pattern (e.g., "intercom.io") used to match request URLs.
 * @param headerToExclude - The name of the header to remove (case-insensitive).
 *
 * @returns A Promise that resolves once the route has been configured.
 */
export async function excludeHeaderFromHost(
	page: Page,
	hostPattern: string,
	headerToExclude: string,
): Promise<void> {
	await page.route(`**${hostPattern}**`, async (route) => {
		const headers = { ...route.request().headers() };
		delete headers[headerToExclude.toLowerCase()];
		await route.continue({ headers });
	});
}

/**
 * Return the Gamdom‑style scrypt hash for a plaintext password.
 * Uses a dynamic import so it works in both CommonJS (Playwright) and ESM.
 */
export async function convertToScryptHash(pwd: string): Promise<string> {
	// `scrypt‑kdf` is ESM only, so we load it dynamically and assert its shape.
	const {
		default: { kdf },
	} = (await import("scrypt-kdf")) as unknown as {
		default: {
			kdf: (
				p: string,
				o: { logN: number; r: number; p: number },
			) => Promise<Buffer>;
		};
	};

	return (await kdf(pwd, { logN: 13, r: 8, p: 1 })).toString("base64");
}

export function formatUserTags(
	tags?: UserTags[] | UserTags,
): string | undefined {
	if (!tags) return undefined;
	if (Array.isArray(tags)) return tags.join(",");
	return tags;
}

export function convertCoinsToUsd(coins: number): number {
	return coins / 1500;
}

export async function waitForOpenRain(
	gamdomApi: GamdomApi,
	cookie: string,
): Promise<void> {
	await waitUntil(
		async () => {
			const rains = await gamdomApi.getOpenRains({
				Cookie: cookie,
			});
			return (Array.isArray(rains) ? rains : []).some((r) => r.open);
		},
		{
			errorMessage: "No open rains found",
			intervalSeconds: TimeoutSeconds.TEN,
			timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
		},
	);
}
/**
 * Calculates the expected multiplier for a Mines game round.
 *
 * This function simulates the expected multiplier by iterating over each step
 * and applying the formula for the probability of hitting a gem at each stage.
 *
 * Multiplier logic:
 *   - Probability of hitting a gem on each click = remaining gems / remaining fields
 *   - Multiplier for each succesful click = (total remaining fields) / (remaining gems)
 *   - Formula is adjusted with a house edge at the end
 *
 * @param {CalculateMinesMultiplierArgs} args - Configuration object.
 * @param {number} args.stepNumber - Number of successful tile picks.
 * @param {number} args.mines - Total number of mines in the field.
 * @param {number} args.houseEdge - House edge to apply (e.g., 0.01 = 1%).
 * @param {number} [args.fieldSize=25] - Total number of tiles (default: 25).
 * @returns {number} The final multiplier rounded to 4 decimal places.
 */
export function calculateMinesMultiplier(
	args: CalculateMinesMultiplierArgs,
): number {
	const {
		stepNumber,
		mines,
		houseEdge,
		fieldSize = 25,
		precision = 2,
	} = args;

	const gems = fieldSize - mines;

	if (stepNumber > gems || stepNumber < 1) {
		throw new Error("Invalid step number");
	}

	let multiplier = 1;

	for (let i = 0; i < stepNumber; i++) {
		multiplier *= (fieldSize - i) / (gems - i);
	}

	multiplier *= 1 - houseEdge;

	return Number(multiplier.toFixed(precision));
}

/**
 * Returns the current date as a string in the specified format.
 * Example output: "2025-06-10"
 *
 * @param dateFormat - The format string compatible with date-fns.
 * @returns The formatted current date.
 */
export function getCurrentDate(dateFormat = "yyyy-MM-dd"): string {
	return format(new Date(), dateFormat);
}
