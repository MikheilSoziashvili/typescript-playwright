import { IAttributeBuilder } from "./attribute-builder.interface";
import {
	ReportPortalConfig,
	ReportPortalAttribute,
} from "../types/reportportal-types";
import * as Configuration from "configuration";

/**
 * Builds defect attributes from known bug tickets
 */
export class DefectAttributeBuilder implements IAttributeBuilder {
	build(config: ReportPortalConfig): ReportPortalAttribute[] {
		if (!config.bugTickets?.length) {
			return [];
		}

		return config.bugTickets.map((ticket) => ({
			key: "defect",
			value: this.formatTicket(ticket),
		}));
	}

	/**
	 * Formats ticket number to full JIRA format
	 * If ticket already has prefix, returns as-is
	 * Otherwise prepends project key prefix (e.g., ENG-)
	 */
	private formatTicket(ticket: string): string {
		if (ticket.includes("-")) {
			return ticket;
		}

		return `${Configuration.jira.projectKey}-${ticket}`;
	}
}
