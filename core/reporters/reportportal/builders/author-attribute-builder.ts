import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";

/**
 * Builds author attribute from configuration
 */
export class AuthorAttributeBuilder implements IAttributeBuilder {
	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		if (!config.author) {
			return [];
		}

		return [
			{
				key: "author",
				value: String(config.author),
			},
		];
	}
}
