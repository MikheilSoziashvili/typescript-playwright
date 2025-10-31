import { FireblocksErrorCode } from "@enums/fireblocks-errors-codes";

export class FireblocksConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = FireblocksErrorCode.Config;
	}
}

export class FireblocksTransactionError extends Error {
	constructor(message: string, public readonly txId?: string) {
		super(message);
		this.name = FireblocksErrorCode.Transaction;
	}
}

export class FireblocksTimeoutError extends Error {
	constructor(message: string, public readonly txId: string) {
		super(message);
		this.name = FireblocksErrorCode.Timeout;
	}
}
