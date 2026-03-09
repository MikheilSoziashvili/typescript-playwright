export interface ChangePasswordCsvRecord {
	Scenario: string;
	OldPassword: string;
	NewPassword: string;
	RepeatPassword: string;
	ExpectedResult: string;
}

export type ChangePasswordCsv = ChangePasswordCsvRecord[];

