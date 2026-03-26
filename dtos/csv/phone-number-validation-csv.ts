export interface PhoneNumberValidationCsvRecord {
	inputValue: string;
	buttonAction: string;
	expectedResult: string;
	notificationMessage: string;
	comments: string;
}

export type PhoneNumberValidationCsv = PhoneNumberValidationCsvRecord[];
