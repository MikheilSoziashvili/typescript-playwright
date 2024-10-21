import { CredentialsType } from "@core/types/types";
import { asString } from "@core/utils/utils";

// google auth
export const GOOGLE_AUTH_CREDENTIALS: CredentialsType = {
	username: asString(process.env.GOOGLE_USERNAME),
	password: asString(process.env.GOOGLE_PASSWORD),
	email: asString(process.env.GOOGLE_EMAIL),
};

// gamdom admins
export const SUPER_ADMIN_CREDENTIALS: CredentialsType = {
	username: "superadmin",
	password: "password",
};

// gamdom users
export const USER_1_CREDENTIALS: CredentialsType = {
	username: "user1",
	password: "password",
	email: "user1@example.com",
};

export const USER_2_CREDENTIALS: CredentialsType = {
	username: "user2",
	password: "password",
};

// super admin NoBulkAdmin assigned
export const SUPER_ADMIN_VIP_MANAGER_NO_BULK: CredentialsType = {
	username: "superAdminVipManagerNoBulk",
	password: "password",
};

// super admin BulkAdmin assigned
export const SUPER_ADMIN_VIP_MANAGER_BULK: CredentialsType = {
	username: "superAdminVipManagerWithBulk",
	password: "password",
};
