import { Reporter } from "@playwright/test/reporter";
import { XrayApi } from "../../api/xray-api";
import { readFromJSONFile } from "../utils";
import { logger } from "../../logger/logger";
import { expect } from "@playwright/test";
import * as Configuration from "../../configuration";
import fs from "fs";
import xml2js from "xml2js";

// TODO: Move to utils
async function parseXmlFile(filePath: string) {
	if (!fs.existsSync(filePath)) {
		throw Error(`File not found: ${filePath}`);
	}

	const xmlContent = fs.readFileSync(filePath, { encoding: "utf8" });
	const parser = new xml2js.Parser();
	return parser.parseStringPromise(xmlContent);
}

async function updateXmlWithTestKeys(filePath: string, xmlData: any) {
	xmlData.testsuites.testsuite.forEach((suite: any) => {
		suite.testcase.forEach((testcase: any) => {
			const match = testcase.$.name.match(/\[(QA-\d+)\]/);
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
	fs.writeFileSync(filePath, updatedXml);
}

async function addTestKeysToXmlReport(filePath: string) {
	const xmlData = await parseXmlFile(filePath);
	await updateXmlWithTestKeys(filePath, xmlData);
}

async function handleTestResults(
	issueKey: string,
	createExecution: boolean,
): Promise<void> {
	if (createExecution && issueKey) {
		await addTestKeysToXmlReport("./results.xml");
		logger.info(`Test execution key is ${issueKey}`);
		logger.info("Uploading XML report...");

		const xrayApi = new XrayApi();
		await xrayApi.initialize();

		const response = await xrayApi.importXmlResult(issueKey);

		expect(response.status()).toBe(200);
		logger.info(
			`Report is uploaded successfully in Test Execution ${issueKey}`,
		);
	} else {
		logger.info("Test results are not imported into XRay.");
	}
}

export default class CustomReporter implements Reporter {
	async onExit(): Promise<void> {
		const keystore = await readFromJSONFile(Configuration.keystore);
		const issueKey = keystore.issueKey as string;

		await handleTestResults(issueKey, keystore.createExecution as boolean);
	}
}
