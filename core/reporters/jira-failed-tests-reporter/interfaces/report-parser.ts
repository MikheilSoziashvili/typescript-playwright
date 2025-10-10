import { ParsedTest } from "../models/parsed-test";

export interface IReportParser {
	parse(reportPath: string): ParsedTest[];
}
