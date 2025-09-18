import { CSVDataSource } from "./core/csv-data-source";
import { PredefinedDataSource } from "./core/predefined-data-source";
import { PredefinedRandomDataSource } from "./core/predefined-random-data-source";
import { CsvDtoMap } from "./mappings/csv-dto-map";
import {
	CsvTransformerExistingReturnType,
	CsvTransformerFunctionType,
	CsvTransformerMap,
	CsvTransformerMapType,
} from "./mappings/csv-transformer-map";

export class TestDataManager {
	/**
	 * Loads raw CSV rows without any transformation.
	 *
	 * @typeParam T - The key corresponding to the CSV file in the CsvDtoMap.
	 * @param params.file - The CSV file name key to load.
	 * @returns An array of raw records as defined in CsvDtoMap[T].
	 */
	public fromCsvRaw<T extends keyof CsvDtoMap>(params: {
		file: T;
	}): CsvDtoMap[T] {
		const loader = new CSVDataSource(params.file);
		return loader.loadRaw<CsvDtoMap[T]>();
	}

	/**
	 * Loads and parses CSV rows using a transformer function.
	 *
	 * @typeParam T - The key corresponding to the transformer in CsvTransformerMapType.
	 * @param params.file - The CSV file name key to load.
	 * @param params.transform - Optional transform function to apply; falls back to the default if not provided.
	 * @returns An array of transformed records.
	 */
	public fromCsvParsed<T extends keyof CsvTransformerMapType>(params: {
		file: T;
		transform?: CsvTransformerFunctionType<T>;
	}): CsvTransformerExistingReturnType<T> {
		const loader = new CSVDataSource(params.file);
		const fallbackTransform = CsvTransformerMap[params.file];
		const finalTransform = params.transform ?? fallbackTransform;

		return loader.loadParsed<T>({
			transform: finalTransform as CsvTransformerFunctionType<T>,
		});
	}

	/**
	 * Creates a new data source for static predefined test data.
	 *
	 * @returns An instance of {@link PredefinedDataSource}.
	 */
	public fromPredefined(): PredefinedDataSource {
		return new PredefinedDataSource();
	}

	/**
	 * Creates a new data source for randomized predefined test data.
	 *
	 * @returns An instance of {@link PredefinedRandomDataSource}.
	 */
	public fromPredefinedRandom(): PredefinedRandomDataSource {
		return new PredefinedRandomDataSource();
	}
}

export const testData = (): TestDataManager => new TestDataManager();
