import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

/**
 * Ensures that the specified directory exists.
 * Creates the directory recursively if it does not exist.
 * @param absDirPath - Absolute path to the directory.
 */
export function ensureDir(absDirPath: string): void {
	if (!fs.existsSync(absDirPath))
		fs.mkdirSync(absDirPath, { recursive: true });
}

/**
 * Reads a CSV file and returns its contents as a 2D array of strings.
 * Preserves empty lines.
 * @param absPath - Absolute path to the CSV file.
 * @returns Array of rows, each row is an array of column values.
 * @throws If the CSV file is empty.
 */
export function readCsv(absPath: string): string[][] {
	const raw = fs.readFileSync(absPath, "utf8");
	const records = parse(raw, {
		skip_empty_lines: false,
	}) as unknown as string[][];
	if (records.length === 0) throw new Error(`CSV is empty: ${absPath}`);
	return records;
}

/**
 * Converts a 2D array of strings to CSV format and writes it to a file.
 * @param absPath - Absolute path to the output CSV file.
 * @param rows - 2D array of strings representing CSV rows and columns.
 */
export function writeCsv(absPath: string, rows: string[][]): void {
	const out = rows.map((r) => r.join(",")).join("\n");
	ensureDir(path.dirname(absPath));
	fs.writeFileSync(absPath, out, "utf8");
}

/**
 * Replaces first-column placeholders (user1, user2, ...) in a template CSV with provided user IDs.
 * Writes the resulting CSV to the specified output path.
 * @param templateAbsPath - Absolute path to the template CSV file.
 * @param outAbsPath - Absolute path to the output CSV file.
 * @param ids - Array of user IDs to replace placeholders.
 * @returns The full set of rows written to the output file.
 */
export function writeCsvReplacingUserIdsFromTemplate(
	templateAbsPath: string,
	outAbsPath: string,
	ids: string[],
): string[][] {
	const records = readCsv(templateAbsPath);
	const [header, ...rows] = records;

	const replaced = rows.map((cols) => {
		if (!cols.length) return cols;
		const token = cols[0]; // first column is userId
		const m = /^user(\d+)$/.exec(token);
		if (m) {
			const idx = Number(m[1]) - 1; // user1 -> 0
			if (ids[idx]) cols[0] = ids[idx];
		}
		return cols;
	});

	const finalRows = [header, ...replaced];
	writeCsv(outAbsPath, finalRows);
	return finalRows;
}

/**
 * Builds a CSV file from a template by replacing user ID placeholders.
 * The new file is created in the same directory as the template, prefixed with TEMP_.
 * @param templateRelPath - Relative path to the template CSV file.
 * @param ids - Array of user IDs to replace placeholders.
 * @returns Object containing the absolute path to the output file and the rows written.
 */
export function buildCsvFromTemplate(
	templateRelPath: string,
	ids: string[],
): { outAbsPath: string; rows: string[][] } {
	const templateAbsPath = path.resolve(templateRelPath);
	const outDir = path.dirname(templateAbsPath);
	ensureDir(outDir);

	const templateBase = path.basename(
		templateAbsPath,
		path.extname(templateAbsPath),
	);
	const outFileName = `TEMP_${templateBase}.csv`;
	const outAbsPath = path.join(outDir, outFileName);

	const rows = writeCsvReplacingUserIdsFromTemplate(
		templateAbsPath,
		outAbsPath,
		ids,
	);
	return { outAbsPath, rows };
}
