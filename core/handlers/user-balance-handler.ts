import { CurrencyApi } from "@api/currency-api";
import { BaseComponent } from "@base/base-component";
import { BaseMap } from "@base/base-map";
import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { GetWalletsResponse } from "@dtos/responses/currency-api/get-wallets-response";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { logger } from "@logger/logger";
import { Locator, Page } from "@playwright/test";
import accounting from "accounting";

const COINS_PER_USD = 1500;

/** atomic-unit divisors → whole-coin */
const ATOMIC_DIVISOR: Record<Unit, number> = {
	BTC_SATOSHI: 1e8,
	ETH_GWEI: 1e9,
	LTC_LITOSHI: 1e8,
	TRX_SUN: 1e6,
	XRP_DROP: 1e6,
	DOGE_SHIBE: 1e8,
	SOL_LAMPORT: 1e9,
	COINS: 1,
};

/**
 * Handles centralized user balance operations such as fetching, parsing, rounding,
 * converting to coins, formatting, and validation.
 */
export class UserBalanceHandler extends BaseComponent<BaseMap> {
	private readonly header: AuthenticatedHeader;
	private readonly currencyApi = new CurrencyApi();

	constructor(page: Page) {
		super(page, {} as BaseMap);
		this.header = new AuthenticatedHeader(page);
	}

	/** Required by {@link BaseComponent}; not used in this helper class. */
	public assertThat(): void {
		throw new Error("assertThat not implemented for UserBalanceHandler");
	}

	private async loadBalance(): Promise<Locator> {
		return this.header.map.getLoadedAccountBalance();
	}

	/** Returns the raw balance text displayed on the UI. */
	public async getRawBalanceText(): Promise<string> {
		return (await this.loadBalance()).innerText();
	}

	/**
	 * Parses the numeric amount from a raw balance string.
	 *
	 * @param rawText A raw string like "$1,234.56" or "1 234,56 EUR"
	 * @returns Parsed number (e.g., 1234.56)
	 */
	public async parseAmount(): Promise<number> {
		return accounting.unformat(await this.getRawBalanceText());
	}

	/**
	 * Converts a USD amount to coins using the static 1500× rule.
	 *
	 * @param usd Dollar amount (float).
	 * @returns Integer coins.
	 */
	public usdToCoins(usd: number): number {
		return Math.round(usd * COINS_PER_USD);
	}

	/**
	 * Utility for converting coins to USD using the static rule.
	 *
	 * @param coins  Backend coins (integer).
	 * @returns      Exact USD value as a floating-point number.
	 */
	public coinsToUsd(coins: number): number {
		const usd = coins / COINS_PER_USD;
		return Number(usd.toFixed(2));
	}

	/**
	 * Retrieves the balance of a wallet (DEFAULT or VAULT) in backend coins.
	 *
	 * - For `Unit.COINS` the value is returned as-is (no rounding).
	 * - For crypto units the method converts:
	 *   atomic → whole-coin → USD → coins (×1500).
	 *
	 * @param unit Wallet denomination, e.g. `Unit.COINS` or `Unit.BTC_SATOSHI`.
	 * @param type Wallet group, defaulting to `WalletType.DEFAULT`.
	 * @param headers Optional request headers (e.g. for authentication).
	 * @throws Error when the wallet entry is missing or the backend call fails.
	 */
	public async walletBalanceInCoins(
		unit: Unit = Unit.COINS,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		const wallets: GetWalletsResponse = await this.currencyApi.getWallets(
			headers,
		);

		const entry = wallets.find(
			(w) => w.unit === unit && w.wallet_type === type,
		);

		if (!entry) {
			throw new Error(
				`Wallet entry "${unit}/${type}" not present in /wallets response`,
			);
		}

		/* 1) fiat wallet: already coins */
		if (unit === Unit.COINS) {
			return entry.balance;
		}

		/* 2) crypto wallet: atomic → whole → USD → coins */
		const divisor = ATOMIC_DIVISOR[unit];
		const whole = entry.balance / divisor; // satoshi  → BTC
		const usd = whole * Number(entry.cryptoPrice); // BTC → USD
		return this.usdToCoins(usd); // USD → backend coins
	}

	/**
	 * Converts a fiat amount (EUR, JPY, etc.) to backend coins using dynamic exchange rates.
	 *
	 * @param currency The fiat currency code (e.g. "EUR")
	 * @param wallet   The wallet type to fetch the conversion for
	 * @param amount   Amount in fiat (e.g. 10 EUR)
	 * @param headers  Optional request headers (e.g. for authentication)
	 * @returns        Amount converted to backend coins
	 */
	public async fiatToCoins(
		currency: Currency,
		wallet: Unit,
		amount: number,
		headers?: Record<string, string>,
	): Promise<number> {
		const rateResponse = await this.currencyApi.getCurrency(
			currency,
			wallet,
			headers,
		);
		logger.info("Rate response:", rateResponse);
		const rate = this.parseRateResponse(rateResponse);
		const usd = amount / rate;
		logger.info(
			`amount=${amount}, rate=${rate}, usd=${usd}, coins=${this.usdToCoins(
				usd,
			)}`,
		);
		return this.usdToCoins(usd);
	}

	/**
	 * Converts an amount in backend coins to its fiat equivalent using real-time currency exchange rates.
	 *
	 * - First converts backend coins → USD using the static rule (1 USD = 1500 coins).
	 * - Then converts USD → target fiat currency using live rates from the currency API.
	 *
	 * @param amountInCoins Amount in backend coins to convert.
	 * @param currency      Target fiat currency (e.g. EUR, JPY).
	 * @param headers       Optional request headers (e.g. for authentication).
	 * @returns             Fiat value corresponding to the given coin amount.
	 * @throws              Error if exchange rate data is missing or malformed.
	 */
	public async coinsToFiat(
		amountInCoins: number,
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		const usd = this.coinsToUsd(amountInCoins);
		const rateResponse = await this.currencyApi.getCurrency(
			currency,
			Unit.COINS,
			headers,
		);
		const rate = this.parseRateResponse(rateResponse);
		const fiat = usd * rate;
		logger.info(
			`usd=${usd}, rate=${rate}, fiat=${fiat}, coins=${amountInCoins}`,
		);
		return Number(fiat);
	}

	private parseRateResponse(
		rateResponse: { rate: string } | { rate: string }[],
	): number {
		const rateObj = Array.isArray(rateResponse)
			? rateResponse[0]
			: rateResponse;
		if (typeof rateObj.rate !== "string") {
			throw new Error(
				"Invalid rate response: 'rate' property missing or not a string",
			);
		}
		return parseFloat(rateObj.rate);
	}

	/**
	 * Retrieves the balance of a wallet (DEFAULT or VAULT) in backend USD.
	 *
	 * - For `Unit.COINS` the value is returned as-is (no rounding).
	 * - For crypto units the method converts:
	 *   atomic → whole-coin → USD → coins (×1500).
	 *
	 * @param unit Wallet denomination, e.g. `Unit.COINS` or `Unit.BTC_SATOSHI`.
	 * @param type Wallet group, defaulting to `WalletType.DEFAULT`.
	 * @throws Error when the wallet entry is missing or the backend call fails.
	 */
	public async walletBalanceInUsd(
		unit: Unit = Unit.COINS,
		type: WalletType = WalletType.DEFAULT,
	): Promise<number> {
		const usd = await this.walletBalanceInCoins(unit, type);
		return this.coinsToUsd(usd);
	}

	/**
	 * Returns wallet balance for a given wallet/currency combo, expressed in backend coins.
	 *
	 * This is useful for UI validations where the selected wallet is crypto or USD,
	 * but the display currency is fiat (EUR, JPY, etc.).
	 */
	public async walletBalanceInCurrencyAsCoins(
		unit: Unit = Unit.COINS,
		currency: Currency = Currency.USD,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		// Step 1: get wallet balance in coins
		const coins = await this.walletBalanceInCoins(unit, type, headers);

		// Step 2: convert those coins → fiat → USD → coins again for accuracy
		// Note: This seems redundant but ensures dynamic fiat rate is applied
		const fiatAmount = await this.coinsToFiat(coins, currency, headers);
		return this.fiatToCoins(currency, unit, fiatAmount, headers);
	}
}
