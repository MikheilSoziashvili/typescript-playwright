import { UserProfileItemsLinksAccessibilityCsvRecord } from "@dtos/csv/user-profile-items-links-accessibility-csv";
import { UserMenuOption } from "@enums/user-menu-options";

export interface UserProfileItemsLinksAccessibilityCsvParsedRecord {
	menuItemLink: UserMenuOption;
	userKycLevel: string;
	expectedUrl: string;
}

export const parseUserProfileItemsLinksAccessibilityCsvRow = (
	row: UserProfileItemsLinksAccessibilityCsvRecord,
): UserProfileItemsLinksAccessibilityCsvParsedRecord => ({
	menuItemLink: row.menuItemLink as UserMenuOption,
	userKycLevel: row.userKycLevel,
	expectedUrl: row.expectedUrl,
});
