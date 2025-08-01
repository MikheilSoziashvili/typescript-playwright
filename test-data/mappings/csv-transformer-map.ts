import { OriginalsQuickSelectButtonsCsvRecord } from "@dtos/csv";
import { UserInfoSendNotificationCsvRecord } from "@dtos/csv/user-info-send-notification-csv";
import { CsvFilesName } from "@enums/csv-file-name";
import {
	OriginalsQuickSelectButtonsCsvParsedRecord,
	parseOriginalsQuickSelectButtonsCsvRow,
} from "test-data/parsers/originals-quick-select-buttons-csv-parser";
import {
	parseUserInfoSendNotificationCsvRow,
	UserInfoSendNotificationCsvParsedRecord,
} from "test-data/parsers/user-info-send-notification-csv-parser";

export type CsvTransformerExistingType<T> =
	T extends keyof CsvTransformerMapType ? CsvTransformerMapType[T] : never;

export type CsvTransformerExistingReturnType<
	T extends keyof CsvTransformerMapType,
> = ReturnType<CsvTransformerMapType[T]>[];

export type CsvTransformerExisting<T> = T extends keyof CsvTransformerMapType
	? T
	: never;

export type CsvTransformerMapType = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: (
		row: OriginalsQuickSelectButtonsCsvRecord,
	) => OriginalsQuickSelectButtonsCsvParsedRecord;

	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]: (
		row: UserInfoSendNotificationCsvRecord,
	) => UserInfoSendNotificationCsvParsedRecord;
};

export const CsvTransformerMap: CsvTransformerMapType = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]:
		parseOriginalsQuickSelectButtonsCsvRow,
	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]:
		parseUserInfoSendNotificationCsvRow,
} as const;
