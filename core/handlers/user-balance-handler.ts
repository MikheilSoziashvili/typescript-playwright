import { CurrencyApi } from "@api/currency-api";
import { BaseComponent } from "@base/base-component";
import { BaseMap } from "@base/base-map";
import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { GetCurrencyResponse } from "@dtos/responses/currency-api/get-currency-response";
import { GetWalletsResponse } from "@dtos/responses/currency-api/get-wallets-response";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Locator, Page } from "@playwright/test";
import accounting from "accounting";

const COINS_PER_USD = 1500;

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
 * Handles wallet balance conversions, rounding, and assertions.
 * Mirrors the application's logic for consistent test calculations.
 */
export class UserBalanceHandler extends BaseComponent<BaseMap> {
	private readonly header: AuthenticatedHeader;
	private readonly currencyApi = new CurrencyApi();

	constructor(page: Page) {
		super(page, {} as BaseMap);
		this.header = new AuthenticatedHeader(page);
	}

	/** Not implemented for this handler. */
	public assertThat(): void {
		throw new Error("assertThat not implemented for UserBalanceHandler");
	}

	/**
	 * @returns Locator for the loaded account balance in the UI header.
	 */
	private async loadBalance(): Promise<Locator> {
		return this.header.map.getLoadedAccountBalance();
	}

	/**
	 * Gets the raw text of the account balance from the UI.
	 * @returns Promise resolving to the balance text (string).
	 */
	public async getRawBalanceText(): Promise<string> {
		return (await this.loadBalance()).innerText();
	}

	/**
	 * Parses and returns the numeric account balance from the UI.
	 * @returns Promise resolving to the numeric balance (float).
	 */
	public async getParsedUiBalance(): Promise<number> {
		return accounting.unformat(await this.getRawBalanceText());
	}

	/**
	 * Rounds a number to 2 decimal places using standard rounding.
	 * @param n - Number to round.
	 * @returns Number rounded to 2 decimals.
	 */
	private roundToTwoDecimals(n: number): number {
		return Math.round(n * 100) / 100;
	}

	/**
	 * Converts USD amount to coins, truncating fractional coins.
	 * @param usd - Amount in USD.
	 * @returns Equivalent amount in coins (integer).
	 */
	public usdToCoinsTrunc(usd: number): number {
		return Math.trunc(usd * COINS_PER_USD);
	}

	/**
	 * Converts coins to USD, floored to 2 decimals.
	 * @param coins - Amount in coins.
	 * @returns Equivalent USD amount, floored to 2 decimals.
	 */
	public coinsToUsdFloor(coins: number): number {
		return Math.floor((coins / COINS_PER_USD) * 100) / 100;
	}

	/**
	 * Converts coins to USD without rounding.
	 * @param coins - Amount in coins.
	 * @returns Equivalent USD amount as float.
	 */
	public coinsToUsdRaw(coins: number): number {
		return coins / COINS_PER_USD;
	}

	/**
	 * Retrieves a wallet entry from `/wallets` by unit and type.
	 * @param unit - Wallet unit (e.g., COINS, BTC_SATOSHI).
	 * @param type - Wallet type (e.g., DEFAULT).
	 * @param headers - Optional request headers.
	 * @returns Matching wallet entry from API.
	 * @throws If wallet entry is not found.
	 */
	private async getWalletEntry(
		unit: Unit,
		type: WalletType,
		headers?: Record<string, string>,
	): Promise<GetWalletsResponse[number]> {
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
		return entry;
	}

	/**
	 * Retrieves the display rate (fiat vs. USD) for a currency.
	 * @param currency - Fiat currency.
	 * @param headers - Optional request headers.
	 * @returns Numeric display rate.
	 */
	private async getDisplayRate(
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		const res: GetCurrencyResponse | GetCurrencyResponse[] =
			await this.currencyApi.getCurrency(currency, Unit.COINS, headers);
		const rateObj = Array.isArray(res) ? res[0] : res;
		return parseFloat(rateObj.rate);
	}

	/**
	 * Converts an amount in display currency to coins (truncated).
	 * @param currencyAmount - Amount in display currency.
	 * @param currency - Display currency enum.
	 * @param headers - Optional request headers.
	 * @returns Equivalent coins as integer.
	 */
	public async convertDisplayCurrencyToCoins(
		currencyAmount: number,
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		if (typeof currencyAmount !== "number") {
			throw new Error("Amount must be of type number.");
		}
		const displayRate = await this.getDisplayRate(currency, headers);
		const usdAmount = currencyAmount / displayRate;
		return Math.trunc(usdAmount * COINS_PER_USD);
	}

	/**
	 * Converts display currency amount to smallest crypto unit (truncated).
	 * @param currencyAmount - Amount in display currency.
	 * @param walletUnit - Wallet unit type.
	 * @param currency - Display currency enum.
	 * @param headers - Optional request headers.
	 * @returns Equivalent amount in smallest crypto unit.
	 */
	private async convertDisplayCurrencyToSmallestCryptoUnit(
		currencyAmount: number,
		walletUnit: Unit,
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		if (typeof currencyAmount !== "number") {
			throw new Error("Currency amount must be of type number.");
		}
		if (walletUnit === Unit.COINS) {
			return currencyAmount;
		}
		const entry = await this.getWalletEntry(
			walletUnit,
			WalletType.DEFAULT,
			headers,
		);
		const displayRate = await this.getDisplayRate(currency, headers);
		const conversion = ATOMIC_DIVISOR[walletUnit];
		const nativeUSD = currencyAmount / displayRate;
		const cryptoPriceUSD = +entry.cryptoPrice;
		const cryptoAmountWhole = nativeUSD / cryptoPriceUSD;
		return Math.trunc(cryptoAmountWhole * conversion);
	}

	/**
	 * Converts display currency amount to wallet's native smallest unit.
	 * @param currencyAmount - Amount in display currency.
	 * @param walletUnit - Wallet unit type.
	 * @param currency - Display currency enum.
	 * @param headers - Optional request headers.
	 * @returns Equivalent smallest unit amount.
	 */
	public async convertDisplayCurrencyToWalletAmount(
		currencyAmount: number,
		walletUnit: Unit,
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		if (walletUnit === Unit.COINS) {
			return this.convertDisplayCurrencyToCoins(
				currencyAmount,
				currency,
				headers,
			);
		}
		return this.convertDisplayCurrencyToSmallestCryptoUnit(
			currencyAmount,
			walletUnit,
			currency,
			headers,
		);
	}

	/**
	 * Converts smallest crypto unit to coins.
	 * @param smallestCryptoAmount - Amount in smallest crypto unit.
	 * @param walletUnit - Wallet unit type.
	 * @param headers - Optional request headers.
	 * @returns Equivalent coins (integer).
	 */
	public async smallestCryptoUnitToCoins(
		smallestCryptoAmount: number,
		walletUnit: Unit,
		headers?: Record<string, string>,
	): Promise<number> {
		if (walletUnit === Unit.COINS) {
			return smallestCryptoAmount;
		}
		const entry = await this.getWalletEntry(
			walletUnit,
			WalletType.DEFAULT,
			headers,
		);
		const conversion = ATOMIC_DIVISOR[walletUnit];
		const cryptoRate = +entry.cryptoPrice;
		const usdAmount = (smallestCryptoAmount / conversion) * cryptoRate;
		return Math.round(usdAmount * COINS_PER_USD);
	}

	/**
	 * Converts coins to fiat currency, rounded to 2 decimals.
	 * @param amountInCoins - Amount in coins.
	 * @param currency - Target fiat currency.
	 * @param headers - Optional request headers.
	 * @returns Equivalent fiat amount rounded to 2 decimals.
	 */
	public async coinsToFiatRounded(
		amountInCoins: number,
		currency: Currency,
		headers?: Record<string, string>,
	): Promise<number> {
		const usd = this.coinsToUsdRaw(amountInCoins);
		const rate = await this.getDisplayRate(currency, headers);
		return this.roundToTwoDecimals(usd * rate);
	}

	/**
	 * Converts coins to smallest crypto unit amount.
	 * @param coins - Amount in coins.
	 * @param walletUnit - Wallet unit type.
	 * @param headers - Optional request headers.
	 * @returns Equivalent smallest crypto unit amount.
	 */
	public async coinsToSmallestCryptoUnit(
		coins: number,
		walletUnit: Unit,
		headers?: Record<string, string>,
	): Promise<number> {
		const entry = await this.getWalletEntry(
			walletUnit,
			WalletType.DEFAULT,
			headers,
		);
		const conversion = ATOMIC_DIVISOR[walletUnit];
		const usdAmount = coins / COINS_PER_USD;
		const cryptoRate = +entry.cryptoPrice;
		const cryptoAmountWhole = usdAmount / cryptoRate;
		return Math.round(cryptoAmountWhole * conversion);
	}

	/**
	 * Gets the wallet balance in coins.
	 * @param unit - Wallet unit type (default COINS).
	 * @param type - Wallet type (default DEFAULT).
	 * @param headers - Optional request headers.
	 * @returns Balance in coins.
	 */
	public async walletBalanceInCoins(
		unit: Unit = Unit.COINS,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		const entry = await this.getWalletEntry(unit, type, headers);
		if (unit === Unit.COINS) {
			return entry.balance;
		}
		const divisor = ATOMIC_DIVISOR[unit];
		const whole = entry.balance / divisor;
		const usd = whole * +entry.cryptoPrice;
		return Math.round(usd * COINS_PER_USD);
	}

	/**
	 * Gets wallet balance in fiat without rounding.
	 * @param unit - Wallet unit type.
	 * @param currency - Target fiat currency.
	 * @param type - Wallet type (default DEFAULT).
	 * @param headers - Optional request headers.
	 * @returns Balance in fiat as float.
	 */
	public async walletBalanceInFiatRaw(
		unit: Unit,
		currency: Currency,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		const entry = await this.getWalletEntry(unit, type, headers);
		const displayRate = await this.getDisplayRate(currency, headers);
		if (unit === Unit.COINS) {
			const usd = entry.balance / COINS_PER_USD;
			return usd * displayRate;
		}
		const divisor = ATOMIC_DIVISOR[unit];
		const whole = entry.balance / divisor;
		const usd = whole * +entry.cryptoPrice;
		return usd * displayRate;
	}

	/**
	 * Gets wallet balance in fiat rounded to 2 decimals.
	 * @param unit - Wallet unit type (default COINS).
	 * @param currency - Target fiat currency (default USD).
	 * @param type - Wallet type (default DEFAULT).
	 * @param headers - Optional request headers.
	 * @returns Balance in fiat rounded to 2 decimals.
	 */
	public async walletBalanceInFiatRounded(
		unit: Unit = Unit.COINS,
		currency: Currency = Currency.USD,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		const fiat = await this.walletBalanceInFiatRaw(
			unit,
			currency,
			type,
			headers,
		);
		return this.roundToTwoDecimals(fiat);
	}

	/**
	 * Gets wallet balance in USD floored to 2 decimals.
	 * @param unit - Wallet unit type (default COINS).
	 * @param type - Wallet type (default DEFAULT).
	 * @param headers - Optional request headers.
	 * @returns Balance in USD floored to 2 decimals.
	 */
	public async walletBalanceInUsd(
		unit: Unit = Unit.COINS,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<number> {
		const coins = await this.walletBalanceInCoins(unit, type, headers);
		return this.coinsToUsdFloor(coins);
	}

	/**
	 * Calculates payout coins from stake coins and multiplier.
	 * @param stakeCoins - Bet amount in coins.
	 * @param multiplier - Win multiplier.
	 * @returns Payout coins (truncated).
	 */
	public calculatePayoutCoins(
		stakeCoins: number,
		multiplier: number,
	): number {
		return Math.trunc(stakeCoins * multiplier);
	}
}
