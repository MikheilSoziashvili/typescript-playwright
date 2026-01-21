export type NetworkFeeSpeed = {
	totalFeeInCryptoGas: number;
	totalFeeInCoins: number;
	estimatedConfirmationTime: string;
};

export type GetWithdrawalFeesResponse = {
	LOW: NetworkFeeSpeed;
	MEDIUM: NetworkFeeSpeed;
	HIGH: NetworkFeeSpeed;
	lastUpdated: number;
	expirationTime: number;
};
