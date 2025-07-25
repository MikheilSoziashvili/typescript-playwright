import { OriginalsQuickSelectButtonsCsvRecord } from "@dtos/csv";
import { CsvFilesName } from "@enums/csv-file-name";
import {
	OriginalsQuickSelectButtonsCsvParsedRecord,
	parseOriginalsQuickSelectButtonsCsvRow,
} from "test-data/parsers/originals-quick-select-buttons-csv-parser";

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
};

export const CsvTransformerMap: CsvTransformerMapType = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]:
		parseOriginalsQuickSelectButtonsCsvRow,
} as const;
