import { SetHotWalletE2EConfigRequest } from "@dtos/requests/gamdom-crypto-api/set-hot-wallet-e2e-config-request";

export interface HotWalletConfigScenario extends SetHotWalletE2EConfigRequest {
	isLowWalletBalanceAlertTest: boolean;
	lowWalletBalanceNotificationIntervalMin: number;
	monitorHotWalletBalanceIntervalMin: number;
}
