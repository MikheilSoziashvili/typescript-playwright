/**
 * Maps CSV password placeholders to actual runtime passwords.
 * @param csvValue - The value from the CSV file
 * @param userPassword - The actual user password to use when the placeholder is encountered
 * @param placeholder - The placeholder string in CSV (default: "Correct password")
 * @returns The actual user password if csvValue matches the placeholder, otherwise the csvValue itself
 */
export const mapCsvPassword = (
	csvValue: string,
	userPassword: string,
	placeholder = "Correct password",
): string => (csvValue === placeholder ? userPassword : csvValue);
