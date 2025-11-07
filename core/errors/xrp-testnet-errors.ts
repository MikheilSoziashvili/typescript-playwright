import { XrpTestnetErrorCode } from "@enums/crypto/error-codes/xrp-testnet-error-codes";

export class XrpTestnetConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = XrpTestnetErrorCode.Config;
	}
}

export class XrpTestnetTransactionError extends Error {
	constructor(message: string, public readonly txHash?: string) {
		super(message);
		this.name = XrpTestnetErrorCode.Transaction;
	}
}

export class XrpTestnetFundingError extends Error {
	constructor(message: string, public readonly walletAddress: string) {
		super(message);
		this.name = XrpTestnetErrorCode.Funding;
	}
}

export class XrpTestnetConnectionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = XrpTestnetErrorCode.Connection;
	}
}
