export class DogeTestnetError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DogeTestnetError";
	}
}

export class DogeTestnetConfigError extends DogeTestnetError {
	constructor(message: string) {
		super(message);
		this.name = "DogeTestnetConfigError";
	}
}

export class DogeTestnetConnectionError extends DogeTestnetError {
	constructor(message: string) {
		super(message);
		this.name = "DogeTestnetConnectionError";
	}
}

export class DogeTestnetFundingError extends DogeTestnetError {
	public readonly walletAddress: string;

	constructor(message: string, walletAddress: string) {
		super(message);
		this.name = "DogeTestnetFundingError";
		this.walletAddress = walletAddress;
	}
}

export class DogeTestnetTransactionError extends DogeTestnetError {
	public readonly txHash?: string;

	constructor(message: string, txHash?: string) {
		super(message);
		this.name = "DogeTestnetTransactionError";
		this.txHash = txHash;
	}
}
