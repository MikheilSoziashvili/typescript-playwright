import { CSVDataSource } from "./core/csv-data-source";
import { DomainDataSource } from "./core/domain-data-source";
import { ObjectDataSource } from "./core/object-data-source";
import { PredefinedDataSource } from "./core/predefined-data-source";
import { PredefinedRandomDataSource } from "./core/predefined-random-data-source";
import { RandomDataSource } from "./core/random-data-source";
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
	 * This source exposes stable, non-randomized datasets defined in the
	 * global `predefined` store. It is typically used when tests require
	 * fixed and predictable values across runs (e.g. default wallets,
	 * transaction amounts, or notification templates).
	 *
	 * @returns An instance of {@link PredefinedDataSource}.
	 */
	public fromPredefined(): PredefinedDataSource {
		return new PredefinedDataSource();
	}

	/**
	 * Creates a new data source for randomized predefined test data.
	 *
	 * This source provides deterministic random values generated from
	 * predefined templates (e.g. random strings, promo codes, messages).
	 * Commonly used when stable yet variable data is needed across tests.
	 *
	 * @returns An instance of {@link PredefinedRandomDataSource}.
	 */
	public fromPredefinedRandom(): PredefinedRandomDataSource {
		return new PredefinedRandomDataSource();
	}

	/**
	 * Creates a new data source for fully dynamic random test data.
	 *
	 * This combines both predefined and predefined-random datasets,
	 * enabling access to hybrid data — predefined structures populated
	 * with randomized or dynamically generated values.
	 *
	 * @returns An instance of {@link RandomDataSource}.
	 */
	public fromRandom(): RandomDataSource {
		return new RandomDataSource(
			this.fromPredefined().data,
			this.fromPredefinedRandom().data,
		);
	}

	/**
	 * Creates a new data source for domain-specific test datasets.
	 *
	 * Each domain represents a functional area (e.g. Originals, VIP Manager)
	 * and exposes its own structured collections, utilities, and scenario data.
	 * Useful for organizing test data around business domains.
	 *
	 * @returns An instance of {@link DomainDataSource}.
	 */
	public fromDomain(): DomainDataSource {
		return new DomainDataSource();
	}

	/**
	 * Creates a new data source for test data object factories.
	 *
	 * This source provides access to all strongly-typed object factories
	 * (e.g. {@link BetTestDataObjectFactory}) used to generate structured,
	 * composable test data objects for parameterized or API-based testing.
	 *
	 * @returns An instance of {@link ObjectDataSource}.
	 */
	public fromObject(): ObjectDataSource {
		return new ObjectDataSource();
	}
}

export const testData = (): TestDataManager => new TestDataManager();
