import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";
import { TAG_PREFIX_PATTERN } from "../constants/reportportal-constants";

/**
 * Builds tag attributes from configuration
 */
export class TagAttributeBuilder implements IAttributeBuilder {
	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		if (config.tags.length === 0) {
			return [];
		}

		return config.tags.map((tag) => ({
			value: tag.replace(TAG_PREFIX_PATTERN, ""),
		}));
	}
}
