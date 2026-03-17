export interface ChangePasswordCsvRecord {
	Scenario: string;
	OldPassword: string;
	NewPassword: string;
	RepeatPassword: string;
	IsSubmitButtonActive: string;
	ExpectedResult: string;
}

export type ChangePasswordCsv = ChangePasswordCsvRecord[];

