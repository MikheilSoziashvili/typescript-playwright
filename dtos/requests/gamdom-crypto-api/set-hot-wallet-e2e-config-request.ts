export type SetHotWalletE2EConfigRequest = Record<
	string,
	boolean | number
> & {
	isLowWalletBalanceAlertTest: boolean;
	lowWalletBalanceNotificationIntervalMin: number;
	monitorHotWalletBalanceIntervalMin: number;
};
