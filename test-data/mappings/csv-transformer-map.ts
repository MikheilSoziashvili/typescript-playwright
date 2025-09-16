import {
	OriginalsQuickSelectButtonsCsvRecord,
	PlinkoBetsAcrossMultipleWalletsCsvRecord,
	UserProfileItemsLinksAccessibilityCsvRecord,
} from "@dtos/csv";
import { OriginalsSelfExclusionCsvRecord } from "@dtos/csv/originals-self-exclusion";
import { PlinkoTestDataCsvRecord } from "@dtos/csv/plinko-test-data-csv";
import { UserInfoSendNotificationCsvRecord } from "@dtos/csv/user-info-send-notification-csv";
import { CsvFilesName } from "@enums/csv-file-name";
import {
	OriginalsQuickSelectButtonsCsvParsedRecord,
	parseOriginalsQuickSelectButtonsCsvRow,
} from "test-data/parsers/originals-quick-select-buttons-csv-parser";
import {
	OriginalsSelfExclusionCsvParsedRecord,
	parseOriginalsSelfExclusionCsvRow,
} from "test-data/parsers/originals-self-exclusion-csv-parser";
import {
	parsePlinkoBetsAcrossMultipleWalletsCsvRow,
	PlinkoBetsAcrossMultipleWalletsCsvParsedRecord,
} from "test-data/parsers/plinko-bets-across-multiple-wallets-csv-parser";
import {
	parsePlinkoTestDataCsvRow,
	PlinkoTestDataCsvParsedRecord,
} from "test-data/parsers/plinko-test-data-csv-parser";
import {
	parseUserInfoSendNotificationCsvRow,
	UserInfoSendNotificationCsvParsedRecord,
} from "test-data/parsers/user-info-send-notification-csv-parser";
import {
	parseUserProfileItemsLinksAccessibilityCsvRow,
	UserProfileItemsLinksAccessibilityCsvParsedRecord,
} from "test-data/parsers/user-profile-items-links-accessibility-csv-parser";

export type CsvTransformerExistingType<T> =
	T extends keyof CsvTransformerMapType ? CsvTransformerMapType[T] : never;

export type CsvTransformerExistingReturnType<
	T extends keyof CsvTransformerMapType,
> = ReturnType<CsvTransformerMapType[T]>[];

export type CsvTransformerExisting<T> = T extends keyof CsvTransformerMapType
	? T
	: never;

export type CsvRowType<T extends keyof CsvTransformerMapType> = Parameters<
	CsvTransformerMapType[T]
>[0];

export type CsvTransformerMapType = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: (
		row: OriginalsQuickSelectButtonsCsvRecord,
	) => OriginalsQuickSelectButtonsCsvParsedRecord;

	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]: (
		row: UserInfoSendNotificationCsvRecord,
	) => UserInfoSendNotificationCsvParsedRecord;

	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]: (
		row: UserProfileItemsLinksAccessibilityCsvRecord,
	) => UserProfileItemsLinksAccessibilityCsvParsedRecord;

	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]: (
		row: PlinkoBetsAcrossMultipleWalletsCsvRecord,
	) => PlinkoBetsAcrossMultipleWalletsCsvParsedRecord;

	[CsvFilesName.PLINKO_TEST_DATA]: (
		row: PlinkoTestDataCsvRecord,
	) => PlinkoTestDataCsvParsedRecord;

	[CsvFilesName.ORIGINALS_SELF_EXCLUSION]: (
		row: OriginalsSelfExclusionCsvRecord,
	) => OriginalsSelfExclusionCsvParsedRecord;
};

export const CsvTransformerMap: CsvTransformerMapType = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]:
		parseOriginalsQuickSelectButtonsCsvRow,
	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]:
		parseUserInfoSendNotificationCsvRow,
	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]:
		parseUserProfileItemsLinksAccessibilityCsvRow,
	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]:
		parsePlinkoBetsAcrossMultipleWalletsCsvRow,
	[CsvFilesName.PLINKO_TEST_DATA]: parsePlinkoTestDataCsvRow,
	[CsvFilesName.ORIGINALS_SELF_EXCLUSION]: parseOriginalsSelfExclusionCsvRow,
} as const;
