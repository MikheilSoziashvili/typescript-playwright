import { Feature } from "@enums/feature";

export type SetFeatureStateRequest = {
	feature: Feature;
	enable: boolean;
	isBeta: boolean;
};
