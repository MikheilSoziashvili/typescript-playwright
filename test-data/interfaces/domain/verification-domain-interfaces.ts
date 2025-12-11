import { WithdrawalStatus } from "@enums/admin/withdrawal-status";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	KycAdminActions,
	kycAdminStatus,
	KycLevel3ReviewAction,
	KycLevels,
	VerificationFormType as VerificationFormTypeEnum,
	VerificationTabType,
} from "@enums/verification-enums";
import { Toast } from "@pages/components/toast/toast";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { VerificationPage } from "@pages/verification/verification-page";
import { UserInfoKycAdminPageSteps } from "@pages/admin/user-info-admin/user-info-kyc-admin/user-info-kyc-steps";

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

/**
 * Configuration for a single KYC admin action (either trigger or revoke)
 */
export interface KycAdminActionConfig {
	action: KycAdminActions;
	status: kycAdminStatus;
	assertToast: (toast: Toast) => Promise<void>;
	withdrawalStatusAfterAction: WithdrawalStatus;
	assertVerificationPPage: (
		verificationPage: VerificationPage,
	) => Promise<void>;
	assertWalletModal: (walletModal: WalletModal) => Promise<void>;
}

/**
 * Complete scenario for testing KYC admin trigger/revoke functionality
 */
export interface kycAdminActionsScenario {
	kycLevel: KycLevels;
	trigger: KycAdminActionConfig;
	revoke: KycAdminActionConfig;
}

/**
 * Configuration for KYC Level 3 review actions (approve/reject)
 */
export interface KycLevel3ReviewActionScenario {
	testId: string;
	action: KycLevel3ReviewAction;
	approveOrRejectSubmission: (
		steps: UserInfoKycAdminPageSteps,
	) => Promise<void>;
	expectedToastTitle: ToastTitle;
	expectedToastSubTitle: ToastSubTitle;
	expectedStatus: kycAdminStatus;
	expectedButtons: KycAdminActions[];
}
