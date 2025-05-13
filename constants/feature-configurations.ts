import { UserType } from "@enums/user-types";

export const ALL_USER_TYPES_ENABLED: Partial<Record<UserType, boolean>> = {
	[UserType.REGULAR]: true,
	[UserType.BETA]: true,
	[UserType.QA_USER]: true,
};
