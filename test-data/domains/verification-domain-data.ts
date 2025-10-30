import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import type { VerificationPageSteps } from "@pages/verification/verification-page-steps";
import { VerificationFormType } from "test-data/interfaces/domain";

export class VerificationDomainData {
	/**
	 * Test scenarios for KYC and KYB Level 1 verification flows.
	 *
	 * Both scenarios submit similar forms and expect identical outcomes.
	 */
	public readonly level1VerificationScenarios: VerificationFormType[] = [
		{
			testId: "ENG-8537",
			formType: "KYC",
			fillSubmissionForm: (steps: VerificationPageSteps) =>
				steps.fillInKycLevel1Form(),
			expectedNotificationTitle: NotificationTitle.KYC_VERIFIED,
			expectedNotificationSubTitle:
				NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED,
			expectedToastTitle: ToastTitle.SUCCESS,
			expectedToastSubTitle:
				ToastSubTitle.LEVEL_ONE_VERIFICATION_SUBMITTED,
		},
		{
			testId: "ENG-8539",
			formType: "KYB",
			fillSubmissionForm: (steps: VerificationPageSteps) =>
				steps.fillInKybLevel1Form(),
			expectedNotificationTitle: NotificationTitle.KYC_VERIFIED,
			expectedNotificationSubTitle:
				NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED,
			expectedToastTitle: ToastTitle.SUCCESS,
			expectedToastSubTitle:
				ToastSubTitle.LEVEL_ONE_VERIFICATION_SUBMITTED,
		},
	];
}
