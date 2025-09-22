import {
	CSV_OUT_DIR,
	EV_REWARD_FREE_SPINS_FILE_MAP,
} from "@constants/file-paths";
import { FileKey } from "@core/types/types";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { rewardedUserIdPattern } from "@support/regex-patterns";

/**
 * Ensure the CSV output directory exists, creating it recursively if necessary.
 */
function ensureCsvOutDirExists(dir: string) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Read a CSV file from disk and return records (rows) using csv-parse. */
function readCsvRecords(filePath: string): string[][] {
	const raw = fs.readFileSync(filePath, "utf8");
	const records: string[][] = parse(raw, {
		skip_empty_lines: false,
	}) as unknown as string[][];
	if (records.length === 0) {
		throw new Error(`CSV is empty: ${filePath}`);
	}
	return records;
}

/**
 * Write a CSV file at outPath by replacing userIds in all data rows of the template CSV.
 * For each data row, replace the userId (column 0) with ids[idx] if available, preserving other columns.
 */
function writeCsvReplacingUserIdsFromTemplate(
	templatePath: string,
	outPath: string,
	ids: string[],
): void {
	const records = readCsvRecords(templatePath);
	const [headerRow, ...rows] = records;

	const replacedRows = rows.map((cols, idx) => {
		if (cols.length === 0 || cols.join("").trim() === "") return cols;
		if (idx < ids.length) {
			cols[0] = ids[idx];
		}
		return cols;
	});

	const output = [headerRow, ...replacedRows]
		.map((row) => row.join(","))
		.join("\n");

	fs.writeFileSync(outPath, output, "utf8");
}

/**
 * Build the 1 / 300 / 1000 variants next to the test run.
 * Returns a map of fileKey -> path
 * Use original CSVs as templates for all variants, replacing only userId column
 */
export function buildRewardCsvVariants(spec: {
	ids: string[];
}): Record<FileKey, string> {
	const { ids } = spec;
	ensureCsvOutDirExists(CSV_OUT_DIR);

	const oneOut = path.join(CSV_OUT_DIR, "TEMP_users_1.csv");
	const threeHundredOut = path.join(CSV_OUT_DIR, "TEMP_users_300.csv");
	const thousandOut = path.join(CSV_OUT_DIR, "TEMP_users_1k.csv");

	writeCsvReplacingUserIdsFromTemplate(
		EV_REWARD_FREE_SPINS_FILE_MAP.one_pass,
		oneOut,
		ids.slice(0, 1),
	);
	writeCsvReplacingUserIdsFromTemplate(
		EV_REWARD_FREE_SPINS_FILE_MAP.threeHundred_fail,
		threeHundredOut,
		ids.slice(0, 300),
	);
	writeCsvReplacingUserIdsFromTemplate(
		EV_REWARD_FREE_SPINS_FILE_MAP.thousand_pass,
		thousandOut,
		ids.slice(0, 1000),
	);

	return {
		one_pass: oneOut,
		threeHundred_fail: threeHundredOut,
		thousand_pass: thousandOut,
	};
}

/** Compute payout for a single CSV data row (no header). */
function computeRowPayout(cols: string[]): number {
	let rowTotal = 0;
	for (let t = 0; t < 5; t++) {
		const fsIdx = 3 + t * 3;
		const denomIdx = 4 + t * 3;
		const fsVal = Number(cols[fsIdx] ?? 0);
		const denomVal = Number(cols[denomIdx] ?? 0);
		if (!Number.isNaN(fsVal) && !Number.isNaN(denomVal)) {
			rowTotal += fsVal * denomVal;
		}
	}
	return rowTotal;
}

/** Decide whether a row should be included based on optional userId filter. */
function shouldIncludeRow(cols: string[], filter?: Set<string>): boolean {
	return !filter || filter.has(cols[0]);
}

/** Compute payout from already-parsed CSV records. */
function computePayoutFromRecords(
	records: string[][],
	filter?: Set<string>,
): number {
	let total = 0;
	for (let i = 1; i < records.length; i++) {
		const cols = records[i];
		if (!shouldIncludeRow(cols, filter)) continue;
		total += computeRowPayout(cols);
	}
	return total;
}

/**
 * Compute the total payout of free spins from a CSV file.
 * CSV header format expected:
 * userId,gameCode,wager_1,fs_1,denom_1,wager_2,fs_2,denom_2,... up to 5 sets
 * Total payout per row = sum_i(fs_i * denom_i) where i in [1..5]
 * records[0] is header
 */
export function computePayoutFromCsv(
	csvPath: string,
	opts?: { filterUserIds?: string[] | Set<string> },
): number {
	const records = readCsvRecords(csvPath);
	const filter = opts?.filterUserIds
		? Array.isArray(opts.filterUserIds)
			? new Set(opts.filterUserIds)
			: opts.filterUserIds
		: undefined;
	return computePayoutFromRecords(records, filter);
}

/** Extract userIds from the Success Logs textarea text. Looks for lines like: "Successfully rewarded user #123 ..." */
export function parseUserIdsFromSuccessLogs(logs: string): string[] {
	const ids: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = rewardedUserIdPattern.exec(logs)) !== null) {
		ids.push(m[1]);
	}
	return ids;
}
