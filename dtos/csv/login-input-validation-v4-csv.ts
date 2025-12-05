export interface LoginInputValidationV4CsvRecord {
	username: string;
	password: string;
	expected_username_warning: string;
	expected_password_warning: string;
}

export type LoginInputValidationV4Csv = LoginInputValidationV4CsvRecord[];
