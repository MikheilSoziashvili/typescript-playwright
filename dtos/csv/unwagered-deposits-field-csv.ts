import { UserTags } from "@enums/db/user-tags";

export interface UnwageredDepositsFieldCsvRecord {
	staffRoleTag: UserTags;
}

export type UnwageredDepositsFieldCsv = UnwageredDepositsFieldCsvRecord[];
