export interface UsernameValidationCsvRecord {
	inputValue: string;
	buttonAction: string;
	expectedResult: string;
	notificationMessage: string;
	comments: string;
}

export type UsernameValidationCsv = UsernameValidationCsvRecord[];
