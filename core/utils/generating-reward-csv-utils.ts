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
 * CSV column model used across EV Reward CSVs:
 *
 *  index: 0       1          2          3       4          5          6       7   ...
 *  ------|-------|----------|----------|-------|----------|----------|-------|------
 *         userId  gameCode   wager_1    fs_1    denom_1    wager_2    fs_2    denom_2 ...
 *
 * Each reward *tier* contributes exactly three columns in this order:
 *   [wager_i, fs_i, denom_i] where i ∈ {1..5}.  The first two columns are fixed
 *   (userId, gameCode), so tier i starts at index BASE_AFTER_FIXED + (i-1) * COLS_PER_TIER.
 * 	 the CSV files will need to contain minimum 3 tiers
 */
const BASE_AFTER_FIXED = 2;         // userId, gameCode
const COLS_PER_TIER = 3;            // [wager_i, fs_i, denom_i]
const FS_OFFSET_WITHIN_TIER = 1;    // wager_i + 1 => fs_i
const DENOM_OFFSET_WITHIN_TIER = 2; // wager_i + 2 => denom_i

/**
 * Compute the column indices for fs and denom values for a given reward tier in the CSV.
 *
 * The CSV layout has fixed columns: userId (index 0) and gameCode (index 1),
 * followed by multiple reward tiers, each contributing exactly three columns:
 * [wager_i, fs_i, denom_i] for tier i ∈ {1..5}.
 *
 * This function calculates the zero-based column indices for the fs and denom columns
 * of the specified tier using the constants BASE_AFTER_FIXED, COLS_PER_TIER,
 * FS_OFFSET_WITHIN_TIER, and DENOM_OFFSET_WITHIN_TIER.
 *
 * @param tier - The reward tier number (1-based, from 1 to 5).
 * @returns An object containing the zero-based column indices: { fsIdx, denomIdx }.
 */
export function getFsAndDenomIndices(tier: number): { fsIdx: number; denomIdx: number } {
	const tierBase = BASE_AFTER_FIXED + (tier - 1) * COLS_PER_TIER;
	return {
		fsIdx: tierBase + FS_OFFSET_WITHIN_TIER,
		denomIdx: tierBase + DENOM_OFFSET_WITHIN_TIER,
	};
}

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
		const { fsIdx, denomIdx } = getFsAndDenomIndices(t + 1);
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

/**
 * Read free spins (fs) and denomination (denom) values from a CSV file for a given tier.
 * 
 * The CSV format has fixed columns: userId (index 0) and gameCode (index 1),
 * followed by 5 reward tiers, each contributing exactly three columns:
 * [wager_i, fs_i, denom_i] for tier i ∈ {1..5}.
 * 
 * This function uses constants BASE_AFTER_FIXED and COLS_PER_TIER to calculate
 * the correct indices for fs and denom within the row.
 * 
 * @param csvPath - Path to the CSV file.
 * @param tier - The reward tier (1–5) determining which fs/denom columns to read.
 * @param rowIndex - The row index to read (defaults to 1, skipping the header).
 * @returns An object containing { fs, denom } as numbers.
 */
export function readFsAndDenomFromCsv(
	csvPath: string,
	tier: number,
	rowIndex = 1, // default to first user row (header is at 0)
): { fs: number; denom: number } {
	const records = readCsvRecords(csvPath);
	const cols = records[rowIndex];

	const { fsIdx, denomIdx } = getFsAndDenomIndices(tier);

	return {
		fs: Number(cols[fsIdx]),
		denom: Number(cols[denomIdx]),
	};
}
