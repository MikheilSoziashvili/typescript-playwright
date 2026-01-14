import { ObtEsportsPagesStatusCodeCsvRecord } from "@dtos/csv";

export interface ObtEsportsPagesStatusCodeCsvParsedRecord {
	esportsPageEndfix: string;
	esportSidebarItemName: string;
}

export const parseObtEsportsPagesStatusCodeCsvRow = (
	row: ObtEsportsPagesStatusCodeCsvRecord,
): ObtEsportsPagesStatusCodeCsvParsedRecord => ({
	esportsPageEndfix: row.esportsPageEndfix,
	esportSidebarItemName: row.esportSidebarItemName,
});

