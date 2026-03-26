export interface EmailAddressValidationCsvRecord {
	inputValue: string;
	buttonAction: string;
	notificationMessage: string;
	comments: string;
}

export type EmailAddressValidationCsv = EmailAddressValidationCsvRecord[];
