import { promises as fsPromises } from "fs";
import { logger } from "@logger/logger";
import { JsonData, WaitUntilOptions } from "@core/interfaces";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { users } from "configuration";
import {
	CredentialsType,
	TestUserConfigurationObject,
} from "@core/types/types";
import accounting from "accounting";
import { DEFAULT_CURRENCY } from "@constants/defaults";
import {
	otpAuthSecretPattern,
	pageUrl,
	sanitizeTitlePattern,
} from "@support/regex-patterns";
import fs from "fs";
import xml2js from "xml2js";
import { MAILINATOR_DOMAIN } from "@constants/domains";
import { Protocol } from "@enums/api/protocols";
import { Page } from "playwright";
import { environment_url } from "configuration";
import { AUTH_PATH } from "@constants/file-paths";
import { PNG, PNGOptions } from "pngjs";
import sharp from "sharp";
import jsQR from "jsqr";
import { authenticator } from "otplib";
import { Timeout } from "@enums/timeout";

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

export function parse_csv(...filePath: string[]): unknown {
	const filePathRoot = path.resolve(__dirname, "../..", ...filePath);
	const csvFile = readFileSync(filePathRoot);
	return parse(csvFile, {
		columns: true,
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

export function formatBalance(value: number): string {
	return accounting.formatMoney(value);
}

export function parseMultiplier(rawValue: string): number {
	return Number(rawValue.replace("x", ""));
}

export function range(start: number, stop: number, step = 1): number[] {
	return [...Array(stop - start).keys()]
		.filter((i) => !(i % Math.round(step)))
		.map((v) => start + v);
}

export function parseToFloat(num: number, fractionDigits = 2): string {
	return parseFloat(`${num}`).toFixed(fractionDigits);
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

export async function setAuthenticationCookies(
	page: Page,
	setCookie: string,
): Promise<void> {
	const domain = environment_url.split("://")[1];
	const cookie = [
		{
			name: getCookieName(setCookie),
			value: getCookieValue(setCookie),
			domain: domain,
			path: "/",
			httpOnly: true,
			secure: false,
		},
	];

	await page.context().addCookies(cookie);
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
