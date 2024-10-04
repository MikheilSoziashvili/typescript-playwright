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
import { pageUrl } from "@support/regex-patterns";
import fs from "fs";
import xml2js from "xml2js";
import { MAILINATOR_DOMAIN } from "@constants/domains";
import { Protocol } from "@enums/api/protocols";
import { Page } from "playwright";
import { environment_url } from "configuration";

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

export function buildEndpoint(parameters: {
	path: string;
	id?: string;
	param?: string;
}): string {
	let endpoint = parameters.path;
	if (parameters.id) {
		endpoint = `${endpoint}/${parameters.id}`;
	}
	if (parameters.param) {
		endpoint = `${endpoint}=${parameters.param}`;
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
	const sanitizedTitle = testInfoTitle.replace(/[^a-zA-Z0-9]/g, "_");
	const storageStatePath = path.join(
		process.cwd(),
		"core/.auth",
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
	const sanitizedTitle = testInfoTitle.replace(/[^a-zA-Z0-9]/g, "_");
	const filePath = path.join(
		process.cwd(),
		"core/.auth",
		`${sanitizedTitle}_worker${workerIndex}.json`,
	);

	fs.writeFileSync(filePath, JSON.stringify(userDetails, null, 2), "utf-8");
};
