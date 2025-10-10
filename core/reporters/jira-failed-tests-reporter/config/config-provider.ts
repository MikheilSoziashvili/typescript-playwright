import { jiraFailedTestsReportName } from "configuration";
import { ReporterConfig } from "../models/reporter-config";

export class ConfigProvider {
	getConfig(): ReporterConfig {
		return {
			reportPath: jiraFailedTestsReportName,
			reportUrl: process.env.REPORT_URL || "N/A",
		};
	}
}
