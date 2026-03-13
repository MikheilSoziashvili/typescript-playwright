export enum VerificationFormType {
	KYC = "KYC",
	KYB = "KYB",
}

export enum VerificationTabType {
	VERIFY_YOURSELF = "Verify Yourself",
	VERIFY_BUSINESS = "Verify Business",
}

export enum KycLevels {
	LEVEL_1 = "LEVEL1",
	LEVEL_2 = "LEVEL2",
	LEVEL_2_5 = "LEVEL25",
	LEVEL_3 = "LEVEL3",
}

export const KycLevelDisplayName: Record<KycLevels, string> = {
	[KycLevels.LEVEL_1]: "Level 1",
	[KycLevels.LEVEL_2]: "Level 2",
	[KycLevels.LEVEL_2_5]: "Level 2.5",
	[KycLevels.LEVEL_3]: "Level 3",
};

export enum KycAdminActions {
	TRIGGER = "Trigger",
	REVOKE_TRIGGER = "Revoke Trigger",
	REVIEW_DATA = "Review Data",
	RETRIGGER = "Retrigger",
}

export enum InitialVerificationStatus {
	SUBMITTED = "Submitted",
}

export enum VerificationStatus {
	APPROVED = "Approved",
	DECLINED = "Declined",
	RESUBMISSION = "Resubmission",
}

export enum kycAdminStatus {
	NOT_TRIGGERED = "Not Triggered",
	IN_PROGRESS = "In Progress",
	NEEDS_REVIEW = "Needs Review",
	APPROVED = "Approved",
	REJECTED = "Rejected",
}

export enum SubmitSessionRequestStatus {
	SUBMITTED = "submitted",
}

export enum KycLevel3ReviewAction {
	APPROVE = "Approve",
	REJECT = "Reject",
}

export enum ProofOfFunds {
	BANK_STATEMENT = "Bank statement",
	WAGE_SLIP = "Wage slip",
	INVOICE = "Invoice",
}

export enum KycType {
	PERSONAL = "personal",
	BUSINESS = "business",
}

export enum KycStatus {
	APPROVED = "approved",
	IN_PROGRESS = "in_progress",
	WAITING_REVIEW = "waiting_review",
	NOT_TRIGGERED = "not_triggered",
	REJECTED = "rejected",
}
