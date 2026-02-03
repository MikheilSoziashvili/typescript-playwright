export interface LoginInputValidationCsvRecord {
	username: string;
	password: string;
	expected_username_warning: string;
	expected_password_warning: string;
}

export type LoginInputValidationCsv = LoginInputValidationCsvRecord[];
