// safe: interface only augments static type for IDE autocomplete of dynamic domains
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { objectFactoryRegistry } from "test-data/objects";
import { ObjectFactoryInstances, ObjectFactoryNames } from "test-data/types";

export class ObjectDataSource {
	private readonly _factories: Partial<ObjectFactoryInstances> = {};

	/**
	 * Creates a new data source for accessing all registered object factories.
	 *
	 * Dynamically defines property getters for each factory found in
	 * {@link objectFactoryRegistry}, enabling both static (property)
	 * and dynamic (name-based) access patterns.
	 */
	constructor() {
		for (const name of Object.keys(
			objectFactoryRegistry,
		) as ObjectFactoryNames[]) {
			Object.defineProperty(this, name, {
				get: () => {
					if (!this._factories[name]) {
						const ObjectClass = objectFactoryRegistry[name];
						(
							this._factories as Record<
								ObjectFactoryNames,
								unknown
							>
						)[name] = ObjectClass;
					}
					return this._factories[name];
				},
				enumerable: true,
			});
		}
	}

	/**
	 * Retrieves a factory by its registry name.
	 *
	 * Useful when the factory name is determined at runtime (e.g. from
	 * configuration files, parameterized tests, or loops). This provides
	 * the same instance as the property-based accessor.
	 *
	 * @typeParam T - The key name of the desired factory in {@link ObjectFactoryNames}.
	 * @param name - The name of the factory to retrieve.
	 * @returns The corresponding factory instance.
	 */
	public getFactory<T extends ObjectFactoryNames>(
		name: T,
	): ObjectFactoryInstances[T] {
		return this._factories[name] ?? objectFactoryRegistry[name];
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Typing-only extension for IDE autocomplete of dynamic domains; safe to ignore lint
export interface ObjectDataSource extends ObjectFactoryInstances {}
