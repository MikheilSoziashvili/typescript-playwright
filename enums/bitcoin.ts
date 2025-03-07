export enum BitcoinRpcMethod {
	GET_BLOCKCHAIN_INFO = "getblockchaininfo",
	GET_WALLET_BALANCE = "getbalance",
	SEND_TO_ADDRESS = "sendtoaddress",
	GET_TRANSACTION = "gettransaction",
}

export enum BitcoinFeeEstimateMode {
	UNSET = "unset",
	ECONOMICAL = "economical",
	CONSERVATIVE = "conservative",
}
