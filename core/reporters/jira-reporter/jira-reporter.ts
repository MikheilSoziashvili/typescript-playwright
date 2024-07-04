import { Reporter } from "@playwright/test/reporter";
import { XrayApi } from "@api/xray-api";
import { readFromJSONFile } from "@core/utils";
import { logger } from "@logger/logger";
import { expect } from "@playwright/test";
import * as Configuration from "configuration";
import { parseXmlFile, updateXmlWithTestKeys } from "@core/xml-utils";

export default class JiraReporter implements Reporter {
	private async addTestKeysToXmlReport(filePath: string): Promise<void> {
		const xmlData = await parseXmlFile(filePath);
		await updateXmlWithTestKeys(filePath, xmlData);
	}

	private async handleTestResults(
		issueKey: string,
		createExecution: boolean,
	): Promise<void> {
		if (createExecution && issueKey) {
			await this.addTestKeysToXmlReport("./results.xml");
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

	async onExit(): Promise<void> {
		const keystore = await readFromJSONFile(Configuration.keystore);
		const issueKey = keystore.issueKey as string;

		await this.handleTestResults(
			issueKey,
			keystore.createExecution as boolean,
		);
	}
}
