export enum LowHotWalletBalanceNotification {
	TITLE = "{cryptoTicker} - Low Wallet Balance",
	DESCRIPTION_LOW = "Details: The wallet balance for {cryptoTicker} crypto-currency, on Node .* has fallen below the threshold of .+ at date .+\\. Current balance is .+\\. Immediate attention is required to address the low balance\\.",
	DESCRIPTION_EMPTY = "Details: The wallet balance for {cryptoTicker} crypto-currency,[\\s\\S]*?empty\\. Immediate attention is required to address the low balance\\.",
}
