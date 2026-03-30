export type EditUserData = {
	userclass?: string;
	tags?: string;
	email?: string;
	email_consent?: boolean;
	wager_req_start?: number | null;
	wager_req_end?: number | null;
	gmail_id?: string | null;
	wallet_differences?: unknown[];
};

export type EditUserInfoRequest = {
	userid: number;
	sendUpdateToUser: boolean;
	data: EditUserData;
};
