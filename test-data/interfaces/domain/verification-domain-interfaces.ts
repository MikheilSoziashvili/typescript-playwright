import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import type { VerificationPageSteps } from "@pages/verification/verification-page-steps";

export interface VerificationFormType {
	testId: string;
	formType: "KYC" | "KYB";
	fillSubmissionForm: (steps: VerificationPageSteps) => Promise<void>;
	expectedNotificationTitle: NotificationTitle;
	expectedNotificationSubTitle: NotificationSubTitle;
	expectedToastTitle: ToastTitle;
	expectedToastSubTitle: ToastSubTitle;
}
