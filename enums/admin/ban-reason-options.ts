export enum BanReasonOptions {
	SUPPORT_REQUESTED = "support_requested",
	SUPPORT_REQUESTED_PERMANENT = "support_requested_permanent",
	RESPONSIBLE_GAMBLING = "responsible_gambling",
	ACCOUNT_COMPROMISED = "account_compromised",
	SPORTSBOOK_DECISION = "sportsbook_decision",
	RESTRICTED_COUNTRY = "restricted_country",
	ACCOUNT_CLOSED_DUE_TO_TERMS_VIOLATION = "account_closed_terms_violation",
	CUSTOM = "custom",
}

export const ALL_BAN_REASON_OPTIONS: BanReasonOptions[] =
	Object.values(BanReasonOptions);
