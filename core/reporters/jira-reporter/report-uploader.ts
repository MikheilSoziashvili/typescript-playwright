import { XrayApi } from "@api/xray-api";
import { XmlData, XmlDataTestSuite, XmlDataTestCase, XmlDataProperty } from "@core/types/types";
import { parseXmlFile } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { jira } from "../../../configuration";
import fs from "fs";
import { expect } from "playwright/test";
import xml2js from "xml2js";
import { HttpStatus } from "@enums/http-status";

export default class ReportUploader {
	private issueKey: string;
	private filePath: string;
	private xrayApi: XrayApi;

	constructor(issueKey: string, filePath = "./results.xml") {
		this.issueKey = issueKey;
		this.filePath = filePath;
		this.xrayApi = new XrayApi();
	}

	private async updateXmlWithTestKeys(xmlData: XmlData): Promise<void> {
		const testKeyRegex = new RegExp(
			`\\[(${jira.projectKey}-\\d+)\\]`,
			"g",
		);
		xmlData.testsuites.testsuite.forEach((suite: XmlDataTestSuite) => {
			const expandedTestCases: XmlDataTestCase[] = [];

			suite.testcase.forEach((testcase: XmlDataTestCase) => {
				const matches = [
					...testcase.$.name.matchAll(testKeyRegex),
				];

				if (matches.length === 0) {
					expandedTestCases.push(testcase);
					return;
				}

				for (const match of matches) {
					const baseProperties = testcase.properties
						? testcase.properties[0].property.filter(
								(p) => p.$.name !== "test_key",
							)
						: [];
					const clonedProperties: XmlDataProperty[] = [
						{
							property: [
								...baseProperties,
								{ $: { name: "test_key", value: match[1] } },
							],
						},
					];
					const cloned: XmlDataTestCase = {
						...testcase,
						properties: clonedProperties,
					};
					expandedTestCases.push(cloned);
				}
			});

			suite.testcase = expandedTestCases;
		});

		const builder = new xml2js.Builder();
		const updatedXml = builder.buildObject(xmlData);
		fs.writeFileSync(this.filePath, updatedXml);
	}

	private async addTestKeysToXmlReport(): Promise<void> {
		const xmlData = await parseXmlFile<XmlData>(this.filePath);
		await this.updateXmlWithTestKeys(xmlData);
	}

	public async uploadXmlReport(): Promise<void> {
		await this.addTestKeysToXmlReport();
		logger.info(`Test execution key is ${this.issueKey}`);
		logger.info("Uploading XML report...");

		await this.xrayApi.initialize();

		const response = await this.xrayApi.importXmlResult(this.issueKey);
		expect(response.status()).toBe(HttpStatus.OK);

		logger.info(
			`Report is uploaded successfully in Test Execution ${this.issueKey}`,
		);
	}
}
