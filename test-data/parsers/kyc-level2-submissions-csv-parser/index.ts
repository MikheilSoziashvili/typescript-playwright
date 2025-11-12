import { VerificationStatus } from "@enums/verification-enums";
import { KycLevel2SubmissionsCsvRecord } from "@dtos/csv/kyc-level2-submissions-csv";

export interface KycLevel2SubmissionsCsvParsedRecord {
	decision: VerificationStatus;
	reason: string;
}

export const parseKycLevel2SubmissionsCsvRow = (
	row: KycLevel2SubmissionsCsvRecord,
): KycLevel2SubmissionsCsvParsedRecord => ({
	decision: row.decision,
	reason: row.reason,
});
