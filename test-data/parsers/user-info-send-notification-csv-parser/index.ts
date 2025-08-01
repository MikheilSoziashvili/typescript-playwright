import { UserInfoSendNotificationCsvRecord } from "@dtos/csv/user-info-send-notification-csv";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";

export interface UserInfoSendNotificationCsvParsedRecord {
	user1Tag: UserTags;
	user2Class: UserClasses;
	user2Tags?: UserTags[];
	isEmailWithGamdomDomain: boolean;
}

export const parseUserInfoSendNotificationCsvRow = (
	row: UserInfoSendNotificationCsvRecord,
): UserInfoSendNotificationCsvParsedRecord => ({
	user1Tag: UserTags[row.userTag as keyof typeof UserTags],
	user2Class: row.userRole === "user" ? UserClasses.User : UserClasses.Admin,
	user2Tags:
		row.userRole === "SuperAdmin" ? [UserTags.SuperAdmin] : undefined,
	isEmailWithGamdomDomain: row.userTag !== "UserInfoAdmin",
});
