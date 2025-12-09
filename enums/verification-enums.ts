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

export enum KycAdminActions {
	TRIGGER = "Trigger",
	REVOKE_TRIGGER = "Revoke Trigger",
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
}

export enum SubmitSessionRequestStatus {
	SUBMITTED = "submitted",
}

export enum ProofOfFunds {
	BANK_STATEMENT = "Bank statement",
	WAGE_SLIP = "Wage slip",
	INVOICE = "Invoice",
}
