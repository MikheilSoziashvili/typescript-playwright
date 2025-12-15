import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";

/**
 * Builds arbitrary annotation attributes from configuration
 */
export class ArbitraryAnnotationAttributeBuilder implements IAttributeBuilder {
	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		if (!config.arbitraryAnnotations?.length) {
			return [];
		}

		return config.arbitraryAnnotations.map((annotation) => ({
			key: annotation.type.toLowerCase(),
			value: annotation.description,
		}));
	}
}
