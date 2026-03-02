export type HourlyCryptoBalancesRequest = {
	pagination: {
		page: number;
		pageSize: number;
	};
	filter: Record<string, unknown>;
	sorting: Record<string, unknown>;
};
