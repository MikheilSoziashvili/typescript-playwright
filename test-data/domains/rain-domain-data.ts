import { KycLevels, KycType } from "@enums/verification-enums";

interface KycLevelEntry {
	level: KycLevels;
	type: KycType | null;
}

interface KycLevelConfig {
	label: string;
	levels: KycLevelEntry[];
}

export class RainDomainData {
	public readonly cannotClaimKycLevels: KycLevelEntry[] = [
		{ level: KycLevels.LEVEL_1, type: KycType.PERSONAL },
	];
	public readonly canClaimKycLevels: KycLevelConfig[] = [
		{
			label: KycLevels.LEVEL_2,
			levels: [{ level: KycLevels.LEVEL_2, type: null }],
		},
		{
			label: `${KycLevels.LEVEL_2} + ${KycLevels.LEVEL_3}`,
			levels: [
				{ level: KycLevels.LEVEL_2, type: null },
				{ level: KycLevels.LEVEL_3, type: null },
			],
		},
	];
}
