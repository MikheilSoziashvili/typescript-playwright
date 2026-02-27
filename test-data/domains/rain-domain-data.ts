import { KycLevels, KycType } from "@enums/verification-enums";

export class RainDomainData {
	public readonly cannotClaimKycLevels = [
		{ level: KycLevels.LEVEL_1, type: KycType.PERSONAL },
	];
	public readonly canClaimKycLevels = [
		{ level: KycLevels.LEVEL_2, type: null },
		{ level: KycLevels.LEVEL_3, type: null },
	];
}
