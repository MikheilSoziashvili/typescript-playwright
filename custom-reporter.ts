import { Reporter } from "@playwright/test/reporter";
import { XrayApi } from "./api/xray-api";
import { readFromJSONFile } from "./utils";
import { logger } from "./logger";
import { expect } from "@playwright/test";
import * as Configuration from "./configuration";

export default class CustomReporter implements Reporter {
	async onExit(): Promise<void> {
		// TODO: Move keystore.json to Configuration
		const keystore = await readFromJSONFile(Configuration.keystore);

		if (keystore.createExecution) {
			logger.info("Uploading XML report...");

			const xrayApi = new XrayApi();
			await xrayApi.initialize();

			const issueKey = keystore.issueKey as string;

			const response = await xrayApi.importXmlResult(issueKey);

			expect(response.status()).toBe(200);
			logger.info(
				`Report is uploaded successfully in Test Execution ${issueKey}`,
			);
		}
	}
}
