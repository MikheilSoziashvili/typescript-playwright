/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reporter, FullResult } from "@playwright/test/reporter";
import { logger } from "@logger/logger";
import { uploadXmlReport } from "@core/utils/xml-utils";
import { getKeystore } from "@core/utils/keystore-utils";

export default class JiraReporter implements Reporter {
	async onEnd(result: FullResult): Promise<void> {
		const keystore = await getKeystore();
		const issueKey = keystore.issueKey as string;
		const createExecution = keystore.createExecution as boolean;

		// Upload test results if there are failed tests or if execution creation is requested
		if (result.status === "failed" || (createExecution && issueKey)) {
			await uploadXmlReport(issueKey);
		} else {
			logger.info("Test results are not imported into XRay.");
		}
	}
}
