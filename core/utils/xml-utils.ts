// @core/xml-utils.ts
import { XrayApi } from "@api/xray-api";
import { logger } from "@logger/logger";
import { expect } from "@playwright/test";
import fs from "fs";
import xml2js from "xml2js";
import { XmlData } from "@core/types/types";

export async function parseXmlFile(filePath: string): Promise<XmlData> {
	const xmlContent = fs.readFileSync(filePath, "utf8");
	const parser = new xml2js.Parser();
	return parser.parseStringPromise(xmlContent) as Promise<XmlData>;
}

export async function updateXmlWithTestKeys(
	filePath: string,
	xmlData: XmlData,
): Promise<void> {
	const builder = new xml2js.Builder();
	const updatedXml = builder.buildObject(xmlData);
	fs.writeFileSync(filePath, updatedXml, "utf8");
}

export async function addTestKeysToXmlReport(filePath: string): Promise<void> {
	const xmlData = await parseXmlFile(filePath);
	await updateXmlWithTestKeys(filePath, xmlData);
}

export async function uploadXmlReport(
	issueKey: string,
	filePath = "./results.xml",
): Promise<void> {
	await addTestKeysToXmlReport(filePath);
	logger.info(`Test execution key is ${issueKey}`);
	logger.info("Uploading XML report...");

	const xrayApi = new XrayApi();
	await xrayApi.initialize();

	const response = await xrayApi.importXmlResult(issueKey);
	expect(response.status()).toBe(200);

	logger.info(
		`Report is uploaded successfully in Test Execution ${issueKey}`,
	);
}
