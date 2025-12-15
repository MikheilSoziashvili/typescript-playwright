import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";

/**
 * Interface for attribute builders
 */
export interface IAttributeBuilder {
	build(config: ReportPortalConfig): ReportPortalAttribute[];
}
