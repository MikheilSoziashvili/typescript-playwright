import { VerificationStatus } from "@enums/verification-enums";

export interface KycLevel2SubmissionsCsvRecord {
	decision: VerificationStatus;
	reason: string;
}

export type KycLevel2SubmissionsCsv = KycLevel2SubmissionsCsvRecord[];
