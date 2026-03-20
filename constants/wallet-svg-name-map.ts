import { Wallet } from "@enums/wallets";

export const WALLET_SVG_NAME: Record<string, string> = {
	[Wallet.BTC]: "btc",
	[Wallet.ETH]: "eth",
	[Wallet.LTC]: "ltc",
	[Wallet.TRX]: "trx",
	[Wallet.XRP]: "xrp",
	[Wallet.DOGE]: "doge",
	[Wallet.SOL]: "sol",
	[Wallet.FIAT_TRY]: "usd",
	[Wallet.BNB]: "bnb",
};
