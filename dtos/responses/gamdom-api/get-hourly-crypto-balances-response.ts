export type HourlyCryptoBalance = {
	id: number;
	currency: string;
	backend_title: string;
	amount_crypto: string;
	crypto_price_usd: string;
	amount_usd: string;
	snapshot_time: string;
};

export type HourlyCryptoBalancesResponse = {
	balanceList: HourlyCryptoBalance[];
	total: number;
};
