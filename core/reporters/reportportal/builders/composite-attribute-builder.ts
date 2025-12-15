import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";

/**
 * Composite builder that combines multiple attribute builders
 */
export class CompositeAttributeBuilder implements IAttributeBuilder {
	constructor(private readonly builders: readonly IAttributeBuilder[]) {}

	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		return this.builders.flatMap((builder) => builder.build(config));
	}
}
