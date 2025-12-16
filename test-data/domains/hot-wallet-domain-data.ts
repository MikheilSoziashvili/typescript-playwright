import { SetHotWalletE2EConfigRequest } from "@dtos/requests/gamdom-crypto-api/set-hot-wallet-e2e-config-request";
import { HotWalletConfigScenario } from "../interfaces/domain/hot-wallet-domain-interfaces";
import { CryptoTicker } from "@enums/cryptocurrencies";

export class HotWalletDomainData {
	public readonly lowBalanceAlertScenario: HotWalletConfigScenario = {
		isLowWalletBalanceAlertTest: false,
		lowWalletBalanceNotificationIntervalMin: 3,
		monitorHotWalletBalanceIntervalMin: 1,
	};

	public readonly defaults: SetHotWalletE2EConfigRequest = {
		isLowWalletBalanceAlertTest: false,
		lowWalletBalanceNotificationIntervalMin: 0,
		monitorHotWalletBalanceIntervalMin: 0,
	};

	public readonly lowBalanceAlertTickers: readonly CryptoTicker[] = [
		CryptoTicker.BTC,
		CryptoTicker.LTC,
		CryptoTicker.ETH,
		CryptoTicker.USDT,
		CryptoTicker.TRX,
		CryptoTicker.XRP,
		CryptoTicker.DOGE,
		CryptoTicker.SOL,
		CryptoTicker.USDT_TRX,
		CryptoTicker.USDC_ETH,
		CryptoTicker.USDC_SOL,
	];
}
