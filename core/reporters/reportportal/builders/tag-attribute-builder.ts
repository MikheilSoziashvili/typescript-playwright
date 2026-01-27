import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";
import { TAG_PREFIX_PATTERN } from "../constants/reportportal-constants";

/**
 * Builds tag and component attributes from configuration
 */
export class TagAttributeBuilder implements IAttributeBuilder {
	private static readonly COMPONENT_MARKER = "__component__";

	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		if (config.tags.length === 0) {
			return [];
		}

		return config.tags.map((tag) => {
			const isComponent = tag.startsWith(
				TagAttributeBuilder.COMPONENT_MARKER,
			);

			const cleanTag = isComponent
				? tag.replace(TagAttributeBuilder.COMPONENT_MARKER, "")
				: tag;

			const value = cleanTag.replace(TAG_PREFIX_PATTERN, "");

			const key = isComponent ? "component" : "tag";

			return {
				key,
				value,
			};
		});
	}
}
