import { LoginNotPossibleCsv, OriginalsLaunchFromHomepageCsv, OriginalsQuickSelectButtonsCsv } from "@dtos/csv";
import { CsvFilesName } from "@enums/csv-file-name";

export type CsvDtoMap = {
	[CsvFilesName.LOGIN_NOT_POSSIBLE]: LoginNotPossibleCsv;
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: OriginalsQuickSelectButtonsCsv;
	[CsvFilesName.HOMEPAGE_ORIGINALS_LAUNCH]: OriginalsLaunchFromHomepageCsv;
};
