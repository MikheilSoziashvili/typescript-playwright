import { predefinedRandom } from "test-data/sources/predefined-random";
import { PredefinedRandomData } from "test-data/types";

export class PredefinedRandomDataSource {
	private cache: PredefinedRandomData;

	/**
	 * Creates a new instance of the predefined random data source.
	 *
	 * @param base - Optional initial dataset to use. If not provided,
	 * defaults to a deep clone of the global `predefinedRandom` object.
	 */
	public constructor(base?: PredefinedRandomData) {
		this.cache = base
			? structuredClone(base)
			: structuredClone(predefinedRandom);
	}

	/**
	 * Returns the current randomized dataset.
	 *
	 * @returns The current `PredefinedRandomData`.
	 */
	public get data(): PredefinedRandomData {
		return this.cache;
	}
}
