import { FooterLinksAndEndpointsCsvRecord } from "@dtos/csv";

export interface FooterLinksAndEndpointsCsvParsedRecord {
	linkName: string;
	expectedURL: string;
}

export const parseFooterLinksAndEndpointsCsvRow = (
	row: FooterLinksAndEndpointsCsvRecord,
): FooterLinksAndEndpointsCsvParsedRecord => ({
	linkName: row.linkName,
	expectedURL:
		row.linkName === "Affiliates" ? "/affiliates-info" : row.expectedURL,
});
