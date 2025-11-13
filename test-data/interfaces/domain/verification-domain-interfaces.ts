import { WithdrawalStatus } from "@enums/admin/withdrawal-status";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	KycAdminActions,
	kycAdminStatus,
	KycLevels,
	VerificationFormType as VerificationFormTypeEnum,
	VerificationTabType,
} from "@enums/verification-enums";
import { Toast } from "@pages/components/toast/toast";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
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
