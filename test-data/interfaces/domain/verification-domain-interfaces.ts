import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	VerificationFormType as VerificationFormTypeEnum,
	VerificationTabType,
} from "@enums/verification-enums";
import { VerificationPage } from "@pages/verification/verification-page";

export interface VerificationFormType {
	testId: string;
	formType: VerificationFormTypeEnum;
	fillSubmissionForm: (page: VerificationPage) => Promise<void>;
	expectedNotificationTitle: NotificationTitle;
	expectedNotificationSubTitle: NotificationSubTitle;
	expectedToastTitle: ToastTitle;
	expectedToastSubTitle: ToastSubTitle;
}

export interface FieldValidationScenario {
	inputField: string;
	input: string;
	expectedErrorMessage: string;
}

export interface FieldValidationTestScenario {
	testId: string;
	formType: VerificationFormTypeEnum;
	fieldValidations: FieldValidationScenario[];
	clearFieldValidations: FieldValidationScenario[];
	processInput: (input: string) => string;
	tabType: VerificationTabType;
}
