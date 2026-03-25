import { KycLevels } from "@enums/verification-enums";

export type TriggerKycLevelRequest = {
	userId: number;
	level: KycLevels;
};
