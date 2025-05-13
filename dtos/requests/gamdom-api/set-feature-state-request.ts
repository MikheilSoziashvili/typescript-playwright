import { Feature } from "@enums/feature";
import { UserType } from "@enums/user-types";

export type SetFeatureStateRequest = {
	feature: Feature;
	enable: boolean;
	userType: UserType;
};
