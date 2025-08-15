import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";

export interface UserData {
	userId: number;
	username: string;
	password: string;
	email: string;
	emailVerified: boolean;
	tags?: UserTags[] | UserTags;
	userClass?: UserClasses;
}

export interface CreateUsersWithAmlLevelsOptions {
	users: { level: AmlVerificationLevel }[];
}

export interface AuthenticatedUser {
	user: UserData;
	cookie: string;
}
