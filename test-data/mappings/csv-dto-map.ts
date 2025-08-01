import {
	LoginNotPossibleCsv,
	OriginalsLaunchFromHomepageCsv,
	OriginalsQuickSelectButtonsCsv,
	HomepageTopLineHeaderLinksCsv,
} from "@dtos/csv";
import { CsvFilesName } from "@enums/csv-file-name";

export type CsvDtoMap = {
	[CsvFilesName.LOGIN_NOT_POSSIBLE]: LoginNotPossibleCsv;
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: OriginalsQuickSelectButtonsCsv;
	[CsvFilesName.HOMEPAGE_ORIGINALS_LAUNCH]: OriginalsLaunchFromHomepageCsv;
	[CsvFilesName.HOMEPAGE_TOP_LINE_HEADER_LINKS]: HomepageTopLineHeaderLinksCsv;
};
