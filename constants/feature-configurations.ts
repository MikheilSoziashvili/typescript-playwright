import { UserType } from "@enums/user-types";

export const ALL_USER_TYPES_ENABLED: Partial<Record<UserType, boolean>> = {
	[UserType.REGULAR]: true,
	[UserType.BETA]: true,
	[UserType.QA_USER]: true,
	[UserType.DEVELOPER]: true,
};

export const ALL_USER_TYPES_DISABLED: Partial<Record<UserType, boolean>> = {
	[UserType.REGULAR]: false,
	[UserType.BETA]: false,
	[UserType.QA_USER]: false,
	[UserType.DEVELOPER]: false,
};
