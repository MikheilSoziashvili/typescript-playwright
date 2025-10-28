// safe: interface only augments static type for IDE autocomplete of dynamic domains
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { domainRegistry } from "test-data/domains";
import { IDomainsDataSource } from "test-data/interfaces/domain";
import { DomainInstances, DomainNames } from "test-data/types";

export class DomainDataSource implements IDomainsDataSource {
	private readonly _domains: Partial<DomainInstances> = {};

	/**
	 * Creates a new domain data source.
	 *
	 * Dynamically registers property getters for all domains found in
	 * {@link domainRegistry}, enabling type-safe property access and
	 * lazy instantiation for performance efficiency.
	 */
	constructor() {
		for (const name of Object.keys(domainRegistry) as DomainNames[]) {
			Object.defineProperty(this, name, {
				get: () => {
					if (!this._domains[name]) {
						const DomainClass = domainRegistry[name];
						(this._domains as Record<DomainNames, unknown>)[name] =
							new DomainClass();
					}
					return this._domains[name];
				},
				enumerable: true,
			});
		}
	}

	/**
	 * Combines multiple domain instances into a single object.
	 *
	 * This method is useful when you want to access several domains together
	 * while keeping their data logically separated under their respective keys.
	 *
	 * @typeParam K - Keys corresponding to domain names in {@link DomainNames}.
	 * @param domainNames - One or more domain names to combine.
	 * @returns An object containing each specified domain instance by name.
	 */
	public combine<K extends DomainNames>(
		...domainNames: K[]
	): Pick<DomainInstances, K> {
		const result: Partial<DomainInstances> = {};
		for (const name of domainNames) {
			const self = this as Record<DomainNames, unknown>;
			const domains = result as Record<DomainNames, unknown>;
			domains[name] = self[name];
		}
		return result as Pick<DomainInstances, K>;
	}

	/**
	 * Merges multiple domain datasets into a single flat object.
	 *
	 * Unlike {@link combine}, which preserves domain separation,
	 * this method flattens all properties into one composite object.
	 *
	 * Useful for building unified datasets when cross-domain values
	 * are needed together (e.g. Originals + VIP Manager combined data).
	 *
	 *
	 * @typeParam K - Keys corresponding to domain names in {@link DomainNames}.
	 * @param domainNames - One or more domain names to merge.
	 * @returns A single flattened object containing merged domain data.
	 */
	public merge<K extends DomainNames>(
		...domainNames: K[]
	): Record<string, unknown> {
		const self = this as Record<DomainNames, unknown>;

		return domainNames.reduce<Record<string, unknown>>(
			(acc, name) => ({
				...acc,
				...(self[name] as Record<string, unknown>),
			}),
			{},
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Typing-only extension for IDE autocomplete of dynamic domains; safe to ignore lint
export interface DomainDataSource extends DomainInstances {}
