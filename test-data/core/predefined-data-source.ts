import { predefined } from "test-data/sources/predefined";
import { PredefinedData } from "test-data/types";

export class PredefinedDataSource {
	private cache: PredefinedData;

	/**
	 * Creates a new instance of the predefined data source.
	 *
	 * @param base - Optional initial dataset to use. If not provided,
	 * defaults to a deep clone of the global `predefined` object.
	 */
	public constructor(base?: PredefinedData) {
		this.cache = base ? structuredClone(base) : structuredClone(predefined);
	}

	/**
	 * Returns the current dataset.
	 *
	 * @returns The current `PredefinedData`.
	 */
	public get data(): PredefinedData {
		return this.cache;
	}

	/**
	 * Overrides a single value in the dataset.
	 *
	 * @param selector - A function that selects the value to override.
	 * @param newValue - The new value to set.
	 * @returns void
	 */
	public override<T>(
		selector: (data: PredefinedData) => T,
		newValue: T,
	): void {
		const path = this.getPath(selector);
		this.setValueAtPath(this.cache, path, newValue);
	}

	/**
	 * Overrides multiple values in the dataset.
	 *
	 * @param selectors - Array of functions selecting values to override.
	 * @param newValues - Array of new values corresponding to each selector.
	 * @returns void
	 */
	public overrideMany<T extends unknown[]>(
		selectors: ((data: PredefinedData) => T[number])[],
		newValues: [...T],
	): void {
		selectors.forEach((selector, i) => {
			const path = this.getPath(selector);
			this.setValueAtPath(this.cache, path, newValues[i]);
		});
	}

	/**
	 * Creates a new data source with a single override applied.
	 *
	 * @param selector - A function that selects the value to override.
	 * @param newValue - The new value to set.
	 * @returns A new `PredefinedDataSource` with the override applied.
	 */
	public withOverride<T>(
		selector: (data: PredefinedData) => T,
		newValue: T,
	): PredefinedDataSource {
		const newCache = structuredClone(this.cache);
		const path = this.getPath(selector);
		this.setValueAtPath(newCache, path, newValue);

		return new PredefinedDataSource(newCache);
	}

	/**
	 * Creates a new data source with multiple overrides applied.
	 *
	 * @param selectors - Array of functions selecting values to override.
	 * @param newValues - Array of new values corresponding to each selector.
	 * @returns A new `PredefinedDataSource` with all overrides applied.
	 */
	public withOverrides<T extends unknown[]>(
		selectors: ((data: PredefinedData) => T[number])[],
		newValues: [...T],
	): PredefinedDataSource {
		const newCache = structuredClone(this.cache);
		selectors.forEach((selector, i) => {
			const path = this.getPath(selector);
			this.setValueAtPath(newCache, path, newValues[i]);
		});

		return new PredefinedDataSource(newCache);
	}

	/**
	 * Retrieves multiple values from the dataset.
	 *
	 * @param selectors - One or more selector functions.
	 * @returns A tuple of values in the same order as the selectors.
	 */
	public getMany<T extends unknown[]>(
		...selectors: { [K in keyof T]: (data: PredefinedData) => T[K] }
	): [...T] {
		return selectors.map((selector) => selector(this.cache)) as [...T];
	}

	/**
	 * Picks a subset of values from the dataset by keys.
	 *
	 * @param selectors - An object whose values are selector functions.
	 * @returns An object with the same keys, mapping to the selected values.
	 */
	public pick<Keys extends Record<string, (data: PredefinedData) => unknown>>(
		selectors: Keys,
	): { [K in keyof Keys]: ReturnType<Keys[K]> } {
		const result: Partial<{ [K in keyof Keys]: ReturnType<Keys[K]> }> = {};
		for (const key in selectors) {
			result[key] = selectors[key](this.cache) as ReturnType<
				(typeof selectors)[typeof key]
			>;
		}

		return result as { [K in keyof Keys]: ReturnType<Keys[K]> };
	}

	/**
	 * Computes the property path accessed by a selector function.
	 *
	 * @param selector - A function that selects a nested property.
	 * @returns An array of strings representing the property path.
	 */
	private getPath<T>(selector: (data: PredefinedData) => T): string[] {
		const path: string[] = [];
		const proxy = new Proxy<PredefinedData>({} as PredefinedData, {
			get: (_, key: string | symbol) => {
				path.push(String(key));
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any -- Unavoidable because proxies cannot be strongly typed
				return proxy as any;
			},
		});

		selector(proxy);

		return path;
	}

	/**
	 * Sets a value within an object at a specific property path.
	 *
	 * @param obj - The object to update.
	 * @param path - Array of property keys leading to the target value.
	 * @param value - The new value to assign.
	 * @returns void
	 */
	private setValueAtPath(obj: unknown, path: string[], value: unknown): void {
		let current: unknown = obj;

		for (let i = 0; i < path.length - 1; i++) {
			if (this.isRecord(current)) {
				current = current[path[i]];
			}
		}

		if (this.isRecord(current)) {
			current[path[path.length - 1]] = value;
		}
	}

	/**
	 * Determines whether a value is a non-null object (record).
	 *
	 * @param value - The value to check.
	 * @returns `true` if the value is a record, otherwise `false`.
	 */
	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === "object" && value !== null;
	}
}
