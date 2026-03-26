import { ChangePasswordCsvRecord } from "@dtos/csv/change-password-csv";
import { ToastTitle } from "@enums/toast-titles";

export interface ChangePasswordCsvParsedRecord {
	scenario: string;
	oldPassword: string | null;
	newPassword: string | null;
	repeatPassword: string | null;
	isSubmitButtonActive: boolean;
	expectedResult: string;
	expectedToastTitle: ToastTitle | null;
}

export const parseChangePasswordCsvRow = (
	row: ChangePasswordCsvRecord,
): ChangePasswordCsvParsedRecord => ({
	scenario: row.Scenario,
	oldPassword: row.OldPassword === "empty" ? null : row.OldPassword,
	newPassword: row.NewPassword === "empty" ? null : row.NewPassword,
	repeatPassword:
		row.RepeatPassword === "empty" ? null : row.RepeatPassword,
	isSubmitButtonActive: row.IsSubmitButtonActive === "true",
	expectedResult: row.ExpectedResult,
	expectedToastTitle: row.ExpectedToastTitle
		? (row.ExpectedToastTitle as ToastTitle)
		: null,
});

const CORRECT_PASSWORD_PLACEHOLDER = "Correct password";

export const mapCsvPassword = (
	csvValue: string,
	userPassword: string,
): string =>
	csvValue === CORRECT_PASSWORD_PLACEHOLDER ? userPassword : csvValue;
