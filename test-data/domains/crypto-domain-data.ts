import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";

export class CryptoDomainData {
	/**
	 * List of cryptocurrencies that are integrated with Fireblocks.
	 *
	 * This array contains all crypto currencies and tickers that support
	 * Fireblocks integration for deposit and withdrawal operations.
	 *
	 * @returns An array of {@link Cryptocurrency} and {@link CryptoTicker} values
	 * that are integrated with Fireblocks.
	 */
	public readonly fireblocksIntegrationCryptos: (
		| Cryptocurrency
		| CryptoTicker
	)[] = [
		Cryptocurrency.Ethereum,
		CryptoTicker.USDT,
		CryptoTicker.USDC_ETH,
		CryptoTicker.USDT_TRON,
		Cryptocurrency.Tron,
		Cryptocurrency.Ripple,
		Cryptocurrency.Doge,
		Cryptocurrency.Solana,
		CryptoTicker.USDC_SOL,
	];

	/**
	 * Returns all Fireblocks integration cryptos except those explicitly excluded.
	 *
	 * Useful for running test suites while skipping specific cryptocurrencies.
	 *
	 * @param exclude - One or more {@link Cryptocurrency} or {@link CryptoTicker} values to exclude.
	 * @returns An array of crypto entries excluding the specified ones.
	 */
	public fireblocksIntegrationCryptosExcluding(
		...exclude: (Cryptocurrency | CryptoTicker)[]
	): (Cryptocurrency | CryptoTicker)[] {
		return this.fireblocksIntegrationCryptos.filter(
			(crypto) => !exclude.includes(crypto),
		);
	}
}

