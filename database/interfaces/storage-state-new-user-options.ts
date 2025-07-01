import { Currency } from "@enums/currencies";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { Unit } from "@enums/units";

export interface NewUserOptions {
	username?: string;
	password?: string;
	email?: string;
	amount?: number;
	unit?: Unit;
	startingXp?: number;
	displayCurrency?: Currency;
	emailVerified?: boolean;
	isEmailWithGamdomDomain?: boolean;
	tags?: UserTags[] | UserTags;
	image?: string;
	hasLogMessage?: boolean;
	userClass?: UserClasses;
	totalDeposited?: number;
}
