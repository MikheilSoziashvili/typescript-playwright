import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	KycAdminActions,
	kycAdminStatus,
	KycLevels,
	ProofOfFunds,
	VerificationFormType as VerificationFormTypeEnum,
	VerificationTabType,
} from "@enums/verification-enums";
import { getISODate } from "@core/utils/utils";
import {
	FieldValidationScenario,
	FieldValidationTestScenario,
	KycAdminActionConfig,
	kycAdminActionsScenario,
	VerificationFormType,
} from "test-data/interfaces/domain";
import { VerificationPage } from "@pages/verification/verification-page";
import { faker } from "@faker-js/faker";
import { Toast } from "@pages/components/toast/toast";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { WithdrawalStatus } from "@enums/admin/withdrawal-status";

// ============================================================================
// CONSTANTS - Form Field Names
// ============================================================================

/**
 * KYC form field names
 */
export const KYC_FIELDS = {
	FULL_NAME: "Full name",
	DATE_OF_BIRTH: "Date of Birth",
	COUNTRY: "Country of Residence",
} as const;

/**
 * KYB form field names
 */
export const KYB_FIELDS = {
	BUSINESS_NAME: "Business name",
	BUSINESS_ADDRESS: "Business address",
	REGISTRATION_NUMBER: "Registration number",
} as const;

/**
 * KYC Level 2.5 form field names
 */
export const KYC_LEVEL_2_5_FIELDS = {
	COUNTRY: "Country",
	REASON_FOR_RESIDENCE: "Reason for Residence",
} as const;

// ============================================================================
// CONSTANTS - Date Input Descriptions
// ============================================================================

/**
 * Date input descriptions for test scenarios
 */
export const DATE_INPUT_DESCRIPTIONS = {
	UNDER_18: "Under 18",
	OVER_18: "Over 18",
	OVER_100: "Over 100",
} as const;

/**
 * Special input value to trigger random option selection
 */
export const RANDOM_OPTION = "Random Option";

/*
 * All available Proof of Funds options
 */
export const PROOF_OF_FUNDS_OPTIONS = Object.values(ProofOfFunds);

// ============================================================================
// CONSTANTS - Validation Inputs
// ============================================================================

/**
 * Valid input values for field validation
 */
export const VALID_INPUTS = {
	SINGLE_CHAR: faker.string.alpha(1),
	EXACTLY_100_CHARS: faker.string.alphanumeric(100),
	VALID_NUMBER: faker.string.numeric(9),
	SINGLE_DIGIT: faker.string.numeric(1),
	EMPTY: "",
} as const;

/**
 * Invalid input values for field validation (101 characters - exceeds max length)
 */
export const INVALID_INPUTS = {
	NAME_TOO_LONG: faker.string.alphanumeric(101),
	BUSINESS_TOO_LONG: faker.string.alphanumeric(101),
	ADDRESS_TOO_LONG: faker.string.alphanumeric(101),
	NUMBER_TOO_LONG: faker.string.numeric(101),
} as const;

// ============================================================================
// CONSTANTS - Error Messages
// ============================================================================

/**
 * Error messages for validation scenarios
 */
export const ERROR_MESSAGES = {
	FULL_NAME_REQUIRED: "Full name is required",
	TOO_LONG: "At most 100 characters",
	UNDER_18: "You must be at least 18 years old",
	OVER_100: "You must be less than 100 years old",
	BUSINESS_NAME_REQUIRED: "Business name is required",
	BUSINESS_ADDRESS_REQUIRED: "Business address is required",
	INVALID_REGISTRATION_NUMBER: "Please enter a valid registration number",
	COUNTRY_REQUIRED: "Country is required",
	REASON_FOR_RESIDENCE_REQUIRED: "Reason for residence is required",
	NO_ERROR: "",
} as const;

// ============================================================================
// VERIFICATION DOMAIN DATA CLASS
// ============================================================================

export class VerificationDomainData {
	// ========================================================================
	// UTILITY METHODS
	// ========================================================================

	/**
	 * Converts date description to actual ISO date string
	 * @param input - Date description (e.g., "Under 18", "Over 18", "Over 100")
	 * @returns ISO date string (YYYY-MM-DD format)
	 */
	public convertDateInput(input: string): string {
		if (input === DATE_INPUT_DESCRIPTIONS.UNDER_18) {
			return getISODate({ yearsOffset: -17 }).split("T")[0];
		}
		if (input === DATE_INPUT_DESCRIPTIONS.OVER_18) {
			return getISODate({ yearsOffset: -25 }).split("T")[0];
		}
		if (input === DATE_INPUT_DESCRIPTIONS.OVER_100) {
			return getISODate({ yearsOffset: -101 }).split("T")[0];
		}
		return input;
	}

	// ========================================================================
	// KYC ADMIN ACTIONS - HELPER METHODS
	// ========================================================================

	/**
	 * Creates a standard trigger action configuration.
	 * All trigger actions share: TRIGGER action, IN_PROGRESS status, DISABLED withdrawal status,
	 * and trigger toast assertion with SUCCESS title and KYC_LEVEL_TRIGGERED subtitle.
	 */
	private createStandardTriggerAction(): Omit<
		KycAdminActionConfig,
		"assertVerificationPPage" | "assertWalletModal"
	> {
		return {
			action: KycAdminActions.TRIGGER,
			status: kycAdminStatus.IN_PROGRESS,
			withdrawalStatusAfterAction: WithdrawalStatus.DISABLED,
			assertToast: async (toast: Toast): Promise<void> => {
				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.KYC_LEVEL_TRIGGERED);
			},
		};
	}

	/**
	 * Creates a standard revoke action configuration.
	 * All revoke actions share: REVOKE_TRIGGER action, NOT_TRIGGERED status, ENABLED withdrawal status,
	 * revoke toast assertion, standard verification page, and deposit address visibility.
	 */
	private createStandardRevokeAction(): KycAdminActionConfig {
		return {
			action: KycAdminActions.REVOKE_TRIGGER,
			status: kycAdminStatus.NOT_TRIGGERED,
			assertToast: async (toast: Toast): Promise<void> => {
				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.KYC_LEVEL_REVOKED);
			},
			withdrawalStatusAfterAction: WithdrawalStatus.ENABLED,
			assertVerificationPPage: (
				verificationPage: VerificationPage,
			): Promise<void> =>
				verificationPage
					.assertThat()
					.verificationPageTitleAndTabsAreVisible(),
			assertWalletModal: (walletModal: WalletModal): Promise<void> =>
				walletModal.assertThat().depositAddressInputFieldIsVisible(),
		};
	}

	// ========================================================================
	// LEVEL 1 VERIFICATION SCENARIOS
	// ========================================================================

	/**
	 * Test scenarios for KYC and KYB Level 1 verification flows.
	 *
	 * Both scenarios submit similar forms and expect identical outcomes.
	 */
	public readonly level1VerificationScenarios: VerificationFormType[] = [
		{
			testId: "ENG-8537",
			formType: VerificationFormTypeEnum.KYC,
			fillSubmissionForm: (page: VerificationPage) =>
				page.fillInKycLevel1Form(),
			expectedNotificationTitle: NotificationTitle.KYC_VERIFIED,
			expectedNotificationSubTitle:
				NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED,
			expectedToastTitle: ToastTitle.SUCCESS,
			expectedToastSubTitle:
				ToastSubTitle.LEVEL_ONE_VERIFICATION_SUBMITTED,
		},
		{
			testId: "ENG-8539",
			formType: VerificationFormTypeEnum.KYB,
			fillSubmissionForm: (page: VerificationPage) =>
				page.fillInKybLevel1Form(),
			expectedNotificationTitle: NotificationTitle.KYC_VERIFIED,
			expectedNotificationSubTitle:
				NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED,
			expectedToastTitle: ToastTitle.SUCCESS,
			expectedToastSubTitle:
				ToastSubTitle.LEVEL_ONE_VERIFICATION_SUBMITTED,
		},
	];

	// ========================================================================
	// KYC LEVEL 1 - FIELD VALIDATION SCENARIOS DATASET
	// ========================================================================

	/**
	 * KYC Level 1 field validation scenarios
	 */
	private readonly kycLevel1FieldValidations: FieldValidationScenario[] = [
		{
			inputField: KYC_FIELDS.FULL_NAME,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.FULL_NAME_REQUIRED,
		},
		{
			inputField: KYC_FIELDS.FULL_NAME,
			input: VALID_INPUTS.SINGLE_CHAR,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYC_FIELDS.FULL_NAME,
			input: VALID_INPUTS.EXACTLY_100_CHARS,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYC_FIELDS.FULL_NAME,
			input: INVALID_INPUTS.NAME_TOO_LONG,
			expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
		},
		{
			inputField: KYC_FIELDS.DATE_OF_BIRTH,
			input: DATE_INPUT_DESCRIPTIONS.UNDER_18,
			expectedErrorMessage: ERROR_MESSAGES.UNDER_18,
		},
		{
			inputField: KYC_FIELDS.DATE_OF_BIRTH,
			input: DATE_INPUT_DESCRIPTIONS.OVER_18,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYC_FIELDS.DATE_OF_BIRTH,
			input: DATE_INPUT_DESCRIPTIONS.OVER_100,
			expectedErrorMessage: ERROR_MESSAGES.OVER_100,
		},
		{
			inputField: KYC_FIELDS.COUNTRY,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYC_FIELDS.COUNTRY,
			input: RANDOM_OPTION,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
	];

	/**
	 * KYC Level 1 clear field validation scenarios
	 */
	private readonly kycLevel1ClearFieldValidations: FieldValidationScenario[] =
		[
			{
				inputField: KYC_FIELDS.FULL_NAME,
				input: INVALID_INPUTS.NAME_TOO_LONG,
				expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
			},
		];

	// ========================================================================
	// KYB LEVEL 1 - FIELD VALIDATION SCENARIOS DATASET
	// ========================================================================

	/**
	 * KYB Level 1 field validation scenarios
	 */
	private readonly kybLevel1FieldValidations: FieldValidationScenario[] = [
		{
			inputField: KYB_FIELDS.BUSINESS_NAME,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.BUSINESS_NAME_REQUIRED,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_ADDRESS,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.BUSINESS_ADDRESS_REQUIRED,
		},
		{
			inputField: KYB_FIELDS.REGISTRATION_NUMBER,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.INVALID_REGISTRATION_NUMBER,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_NAME,
			input: VALID_INPUTS.SINGLE_CHAR,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_ADDRESS,
			input: VALID_INPUTS.SINGLE_CHAR,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.REGISTRATION_NUMBER,
			input: VALID_INPUTS.SINGLE_DIGIT,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_NAME,
			input: VALID_INPUTS.EXACTLY_100_CHARS,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_ADDRESS,
			input: VALID_INPUTS.EXACTLY_100_CHARS,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.REGISTRATION_NUMBER,
			input: VALID_INPUTS.VALID_NUMBER,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_NAME,
			input: INVALID_INPUTS.BUSINESS_TOO_LONG,
			expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
		},
		{
			inputField: KYB_FIELDS.BUSINESS_ADDRESS,
			input: INVALID_INPUTS.ADDRESS_TOO_LONG,
			expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
		},
		{
			inputField: KYB_FIELDS.REGISTRATION_NUMBER,
			input: INVALID_INPUTS.NUMBER_TOO_LONG,
			expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
		},
	];

	/**
	 * KYB Level 1 clear field validation scenarios
	 */
	private readonly kybLevel1ClearFieldValidations: FieldValidationScenario[] =
		[
			{
				inputField: KYB_FIELDS.BUSINESS_NAME,
				input: INVALID_INPUTS.BUSINESS_TOO_LONG,
				expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
			},
			{
				inputField: KYB_FIELDS.BUSINESS_ADDRESS,
				input: INVALID_INPUTS.ADDRESS_TOO_LONG,
				expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
			},
			{
				inputField: KYB_FIELDS.REGISTRATION_NUMBER,
				input: INVALID_INPUTS.NUMBER_TOO_LONG,
				expectedErrorMessage: ERROR_MESSAGES.TOO_LONG,
			},
		];

	// ========================================================================
	// KYC LEVEL 2.5 - FIELD VALIDATION SCENARIOS DATASET
	// ========================================================================

	/**
	 * KYC Level 2.5 field validation scenarios
	 */
	private readonly kycLevel2_5FieldValidations: FieldValidationScenario[] = [
		{
			inputField: KYC_LEVEL_2_5_FIELDS.COUNTRY,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.COUNTRY_REQUIRED,
		},
		{
			inputField: KYC_LEVEL_2_5_FIELDS.COUNTRY,
			input: RANDOM_OPTION,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
		{
			inputField: KYC_LEVEL_2_5_FIELDS.REASON_FOR_RESIDENCE,
			input: VALID_INPUTS.EMPTY,
			expectedErrorMessage: ERROR_MESSAGES.REASON_FOR_RESIDENCE_REQUIRED,
		},
		{
			inputField: KYC_LEVEL_2_5_FIELDS.REASON_FOR_RESIDENCE,
			input: RANDOM_OPTION,
			expectedErrorMessage: ERROR_MESSAGES.NO_ERROR,
		},
	];

	/**
	 * KYC Level 2.5 clear field validation scenarios
	 */
	private readonly kycLevel2_5ClearFieldValidations: FieldValidationScenario[] =
		[
			{
				inputField: KYC_LEVEL_2_5_FIELDS.COUNTRY,
				input: RANDOM_OPTION,
				expectedErrorMessage: ERROR_MESSAGES.COUNTRY_REQUIRED,
			},
		];

	// ========================================================================
	// COMBINED FIELD VALIDATION SCENARIOS
	// ========================================================================

	/**
	 * Combined field validation test scenarios for both KYC and KYB Level 1.
	 */
	public readonly level1FieldValidationScenarios: FieldValidationTestScenario[] =
		[
			{
				testId: "ENG-8542",
				formType: VerificationFormTypeEnum.KYC,
				fieldValidations: this.kycLevel1FieldValidations,
				clearFieldValidations: this.kycLevel1ClearFieldValidations,
				processInput: (input: string) => this.convertDateInput(input),
				tabType: VerificationTabType.VERIFY_YOURSELF,
			},
			{
				testId: "ENG-8563",
				formType: VerificationFormTypeEnum.KYB,
				fieldValidations: this.kybLevel1FieldValidations,
				clearFieldValidations: this.kybLevel1ClearFieldValidations,
				processInput: (input: string) => input,
				tabType: VerificationTabType.VERIFY_BUSINESS,
			},
		];

	/**
	 * Combined field validation test scenario for KYC Level 2.5.
	 */
	public readonly level2_5FieldValidationScenarios: FieldValidationTestScenario[] =
		[
			{
				testId: "ENG-8833",
				formType: VerificationFormTypeEnum.KYC,
				fieldValidations: this.kycLevel2_5FieldValidations,
				clearFieldValidations: this.kycLevel2_5ClearFieldValidations,
				processInput: (input: string) => input,
				tabType: VerificationTabType.VERIFY_YOURSELF,
			},
		];

	// ========================================================================
	// KYC ADMIN ACTIONS SCENARIOS
	// ========================================================================

	/**
	 * KYC admin actions test scenarios for triggering and revoking KYC level requirements.
	 */
	public readonly kycAdminActionsScenarios: kycAdminActionsScenario[] = [
		// ====================================================================
		// LEVEL 1
		// ====================================================================
		{
			kycLevel: KycLevels.LEVEL_1,
			trigger: {
				...this.createStandardTriggerAction(),
				assertVerificationPPage: (verificationPage: VerificationPage) =>
					verificationPage
						.assertThat()
						.verificationPageTitleAndTabsAreVisible(),
				assertWalletModal: (walletModal: WalletModal) =>
					walletModal.assertThat().kycLevelOneContainerIsVisible(),
			},
			revoke: this.createStandardRevokeAction(),
		},
		// ====================================================================
		// LEVEL 2
		// ====================================================================
		{
			kycLevel: KycLevels.LEVEL_2,
			trigger: {
				...this.createStandardTriggerAction(),
				assertVerificationPPage: (verificationPage: VerificationPage) =>
					verificationPage
						.assertThat()
						.verifyThatVeriffIFrameIsVisible(),
				assertWalletModal: (walletModal: WalletModal) =>
					walletModal.assertThat().verifyThatVeriffIFrameIsVisible(),
			},
			revoke: this.createStandardRevokeAction(),
		},
		// ====================================================================
		// LEVEL 2.5
		// ====================================================================
		{
			kycLevel: KycLevels.LEVEL_2_5,
			trigger: {
				...this.createStandardTriggerAction(),
				assertVerificationPPage: (verificationPage: VerificationPage) =>
					verificationPage
						.assertThat()
						.kycLevelTwoVerificationTitleIsVisible(),
				assertWalletModal: (walletModal: WalletModal) =>
					walletModal
						.assertThat()
						.kycLevelTwoVerificationTitleIsVisible(),
			},
			revoke: this.createStandardRevokeAction(),
		},
		// ====================================================================
		// LEVEL 3
		// ====================================================================
		{
			kycLevel: KycLevels.LEVEL_3,
			trigger: {
				...this.createStandardTriggerAction(),
				assertVerificationPPage: (verificationPage: VerificationPage) =>
					verificationPage
						.assertThat()
						.kycLevelThreeVerificationHeaderIsVisible(),
				assertWalletModal: (walletModal: WalletModal) =>
					walletModal
						.assertThat()
						.kycLevelThreeVerificationHeaderIsVisible(),
			},
			revoke: this.createStandardRevokeAction(),
		},
	];
}
