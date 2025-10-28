import { predefined } from "test-data/sources/predefined";
import { predefinedRandom } from "test-data/sources/predefined-random";
import { RandomDataSourceGenerator } from "test-data/sources/random";
import { PredefinedData, PredefinedRandomData } from "test-data/types";

export class RandomDataSource {
	public readonly predefined: PredefinedData;
	public readonly predefinedRandom: PredefinedRandomData;

	/**
	 * Creates a new instance of the randomized data source.
	 *
	 * @param basePredefined - Optional base predefined dataset.
	 * If not provided, falls back to a deep clone of the global {@link predefined} source.
	 * @param basePredefinedRandom - Optional base randomized dataset.
	 * If not provided, falls back to a deep clone of the global {@link predefinedRandom} source.
	 */
	constructor(
		basePredefined?: PredefinedData,
		basePredefinedRandom?: PredefinedRandomData,
	) {
		this.predefined = structuredClone(basePredefined ?? predefined);
		this.predefinedRandom = structuredClone(
			basePredefinedRandom ?? predefinedRandom,
		);
	}

	/**
	 * Returns an instance of the {@link RandomDataSourceGenerator}, which
	 * provides property-level accessors for dynamically generated random values.
	 *
	 * Each call to `data` returns a fresh generator that can be used to access
	 * or compose structured random data such as promo codes, notification titles,
	 * or hybrid predefined/randomized fields.
	 *
	 * @returns A new {@link RandomDataSourceGenerator} instance bound to
	 * the current predefined and predefined-random datasets.
	 */
	public get data(): RandomDataSourceGenerator {
		return new RandomDataSourceGenerator(
			this.predefined,
			this.predefinedRandom,
		);
	}
}
