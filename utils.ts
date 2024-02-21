import { promises as fs } from "fs";
import { logger } from "./logger";
import { JsonData } from "./interfaces";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { users } from "./configuration";
import { TestUserConfigurationObject } from "./types";
import * as accounting from "accounting";

export function encodeCredentials(username: string, password: string): string {
	const credentials = `${username}:${password}`;
	return Buffer.from(credentials).toString("base64");
}

export async function readFromJSONFile(filePath: string): Promise<JsonData> {
	const fileContents: string = await fs.readFile(filePath, "utf-8");
	return JSON.parse(fileContents) as JsonData;
}

export async function writeToJSONFile(
	data: object,
	filePath: string,
): Promise<void> {
	try {
		const existingData = JSON.parse(
			await fs.readFile(filePath, "utf-8"),
		) as object;
		await fs.writeFile(
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
	const xmlContent = await fs.readFile(filePath, "utf-8");
	return '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlContent;
}

export function getFilePath(
	filename: string,
	baseDir: string = __dirname,
): string {
	return path.join(baseDir, filename);
}

export function parse_csv(...filePath: string[]): unknown {
	const filePathRoot = [__dirname, ...filePath];
	const csvFile = readFileSync(path.join(...filePathRoot));
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

export function range(
	start: number,
	stop: number,
	step: number = 1,
): Array<number> {
	return [...Array(stop - start).keys()]
		.filter((i) => !(i % Math.round(step)))
		.map((v) => start + v);
}

export function parseToFloat(num: number, fractionDigits: number = 2): string {
	return parseFloat(`${num}`).toFixed(fractionDigits);
}
