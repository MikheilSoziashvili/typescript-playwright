import { XrayApi } from "@api/xray-api";
import { XmlData, XmlDataTestSuite, XmlDataTestCase } from "@core/types/types";
import { parseXmlFile } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { jira } from "../../../configuration";
import fs from "fs";
import { expect } from "playwright/test";
import xml2js from "xml2js";

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
		xmlData.testsuites.testsuite.forEach((suite: XmlDataTestSuite) => {
			suite.testcase.forEach((testcase: XmlDataTestCase) => {
				const match = testcase.$.name.match(
					new RegExp(`\\[(${jira.projectKey}-\\d+)\\]`),
				);
				if (match) {
					if (!testcase.properties) {
						testcase.properties = [{ property: [] }];
					}
					testcase.properties[0].property.push({
						$: { name: "test_key", value: match[1] },
					});
				}
			});
		});

		const builder = new xml2js.Builder();
		const updatedXml = builder.buildObject(xmlData);
		fs.writeFileSync(this.filePath, updatedXml);
	}

	private async addTestKeysToXmlReport(): Promise<void> {
		const xmlData = await parseXmlFile(this.filePath);
		await this.updateXmlWithTestKeys(xmlData);
	}

	public async uploadXmlReport(): Promise<void> {
		await this.addTestKeysToXmlReport();
		logger.info(`Test execution key is ${this.issueKey}`);
		logger.info("Uploading XML report...");

		await this.xrayApi.initialize();

		const response = await this.xrayApi.importXmlResult(this.issueKey);
		expect(response.status()).toBe(200);

		logger.info(
			`Report is uploaded successfully in Test Execution ${this.issueKey}`,
		);
	}
}
