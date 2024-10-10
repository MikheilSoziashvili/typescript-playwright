import { promises as fsPromises } from "fs";
import { logger } from "@logger/logger";
import { JsonData } from "@core/interfaces";
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
import { pageUrl, sanitizeTitlePattern } from "@support/regex-patterns";
import fs from "fs";
import xml2js from "xml2js";
import { MAILINATOR_DOMAIN } from "@constants/domains";
import { Protocol } from "@enums/api/protocols";
import { Page } from "playwright";
import { environment_url } from "configuration";
import { AUTH_PATH } from "@constants/file-paths";
import { PNG, PNGOptions } from "pngjs";

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
export async function hardWait(timeoutInMilliseconds: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, timeoutInMilliseconds));
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
