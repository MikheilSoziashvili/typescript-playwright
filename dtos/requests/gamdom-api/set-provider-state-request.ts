export type SetProviderStateRequest = {
	id: number;
	provider_name: string;
	priority: number;
	disabled: boolean;
	qa_users_only: boolean;
	provider_id: string;
	imported_from: string;
}[];
