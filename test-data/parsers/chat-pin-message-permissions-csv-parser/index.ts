import { ChatPinMessagePermissionsCsvRecord } from "@dtos/csv";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { ToastTitle } from "@enums/toast-titles";

export interface ChatPinMessagePermissionsCsvParsedRecord {
	Userclass: UserClasses;
	Usertag: UserTags;
	Message: ToastTitle;
}

export const parseChatPinMessagePermissionsCsvRow = (
	row: ChatPinMessagePermissionsCsvRecord,
): ChatPinMessagePermissionsCsvParsedRecord => ({
	Userclass: row.Userclass as UserClasses,
	Usertag: row.Usertag as UserTags,
	Message: row.Message as ToastTitle,
});
