import fs from "fs";

import { DATASETS_DIR_PATH } from "@constants/file-paths";
import path from "path";
import { parse } from "csv-parse/sync";
import { CsvFileLoadError, CsvParseError } from "test-data/custom-exceptions";
import {
	CsvTransformerExistingReturnType,
	CsvTransformerFunctionType,
	CsvTransformerMapType,
} from "test-data/mappings/csv-transformer-map";
import { CsvDtoMap } from "test-data/mappings/csv-dto-map";

export class CSVDataSource {
	private readonly CSV_DATASETS_PATH = DATASETS_DIR_PATH;

	constructor(private fileName: string) {}

	/**
	 * Loads raw CSV rows from the specified file without any transformation.
	 *
	 * @typeParam T - The expected shape of the raw parsed records (typically an array of CSV DTOs).
	 * @returns The parsed CSV data as an array of records.
	 * @throws {CsvFileLoadError} If reading or parsing the CSV file fails.
	 */
	public loadRaw<T extends unknown[]>(): T {
		const filePath = path.resolve(this.CSV_DATASETS_PATH, this.fileName);

		try {
			const fileContent = fs.readFileSync(filePath, "utf-8");

			return parse(fileContent, {
				columns: true,
				skip_empty_lines: true,
			}) as T;
		} catch (err) {
			throw new CsvFileLoadError(
				"Failed to load CSV file",
				filePath,
				err as Error,
			);
		}
	}

	/**
	 * Loads and transforms CSV rows using a provided transformer function.
	 *
	 * @typeParam T - A key from the CsvTransformerMapType, representing the CSV file and its associated transformer.
	 * @param params.transform - The function used to map raw rows to their parsed representations.
	 * @returns An array of transformed records.
	 * @throws {CsvParseError} If loading or transforming the CSV data fails.
	 */
	public loadParsed<T extends keyof CsvTransformerMapType>(params: {
		transform: CsvTransformerFunctionType<T>;
	}): CsvTransformerExistingReturnType<T> {
		try {
			const csvRaw = this.loadRaw<CsvDtoMap[T]>();
			const csvMapped = csvRaw.map((row) => params.transform(row));

			return csvMapped as CsvTransformerExistingReturnType<T>;
		} catch (err) {
			throw new CsvParseError("Failed to parse CSV file", err as Error);
		}
	}
}
