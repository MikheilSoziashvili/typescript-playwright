import { Reporter } from "@playwright/test/reporter";
import { logger } from "@logger/logger";
import ReportUploader from "@core/reporters/jira-reporter/report-uploader";
import { readFromJSONFile } from "@core/utils/utils";
import { keystore } from "../../../configuration";

export default class JiraReporter implements Reporter {
	async onEnd(): Promise<void> {
		const keystoreData = await readFromJSONFile(keystore);
		const issueKey = keystoreData.issueKey as string;
		const createExecution = keystoreData.createExecution as boolean;

		if (createExecution && issueKey) {
			const uploader = new ReportUploader(issueKey);
			await uploader.uploadXmlReport();
		} else {
			logger.info("Test results are not imported into XRay.");
		}
	}
}
