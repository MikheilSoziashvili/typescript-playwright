import fs from "fs";
import { IReportValidator } from "../interfaces/report-validator";

export class FileSystemReportValidator implements IReportValidator {
	exists(reportPath: string): boolean {
		return fs.existsSync(reportPath);
	}
}
