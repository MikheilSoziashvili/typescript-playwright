import { ChatPinMessagePermissionsCsvRecord } from "@dtos/csv";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";

export interface ChatPinMessagePermissionsCsvParsedRecord {
	Userclass: UserClasses;
	Usertag: UserTags;
}

export const parseChatPinMessagePermissionsCsvRow = (
	row: ChatPinMessagePermissionsCsvRecord,
): ChatPinMessagePermissionsCsvParsedRecord => ({
	Userclass: row.Userclass as UserClasses,
	Usertag: row.Usertag as UserTags,
});
