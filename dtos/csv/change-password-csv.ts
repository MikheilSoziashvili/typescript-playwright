export interface ChangePasswordCsvRecord {
	Scenario: string;
	OldPassword: string;
	NewPassword: string;
	RepeatPassword: string;
	IsSubmitButtonActive: string;
	ExpectedResult: string;
	ExpectedToastTitle?: string;
}

export type ChangePasswordCsv = ChangePasswordCsvRecord[];

