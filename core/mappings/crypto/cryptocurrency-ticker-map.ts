import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";

export const cryptocurrencyTickerMap: Record<Cryptocurrency, CryptoTicker> = {
	[Cryptocurrency.Bitcoin]: CryptoTicker.BTC,
	[Cryptocurrency.Litecoin]: CryptoTicker.LTC,
	[Cryptocurrency.Ethereum]: CryptoTicker.ETH,
	[Cryptocurrency.Tether]: CryptoTicker.USDT,
	[Cryptocurrency.USDC]: CryptoTicker.USDC,
	[Cryptocurrency.Tron]: CryptoTicker.TRX,
	[Cryptocurrency.Ripple]: CryptoTicker.XRP,
	[Cryptocurrency.Doge]: CryptoTicker.DOGE,
	[Cryptocurrency.Solana]: CryptoTicker.SOL,
};
