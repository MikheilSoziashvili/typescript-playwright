export enum UtxoRpcMethod {
	GET_BLOCKCHAIN_INFO = "getblockchaininfo",
	GET_WALLET_BALANCE = "getbalance",
	SEND_TO_ADDRESS = "sendtoaddress",
	GET_TRANSACTION = "gettransaction",
}

export enum UtxoFeeEstimateMode {
	UNSET = "unset",
	ECONOMICAL = "economical",
	CONSERVATIVE = "conservative",
}
