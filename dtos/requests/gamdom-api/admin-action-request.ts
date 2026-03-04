import { AdminActionType } from "@enums/admin-action-types";

export type AdminActionRequest = {
	type: AdminActionType;
	reason?: string;
	id: number;
};
