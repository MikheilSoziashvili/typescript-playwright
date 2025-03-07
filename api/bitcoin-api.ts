import { BaseApi } from "./base-api";
import { APIResponse } from "@playwright/test";
import { BitcoinConfig } from "../configuration";
import { encodeCredentials } from "@core/utils/utils";
import { GetBlockchainInfoResponse } from "@dtos/responses/bitcoin-api/get-blockchain-info-response";
import { GetTransactionResponse } from "@dtos/responses/bitcoin-api/get-transaction-response";
import { GetWalletBalanceResponse } from "@dtos/responses/bitcoin-api/get-wallet-balance-response";
import { SendBTCResponse } from "@dtos/responses/bitcoin-api/send-btc-response";
import { BitcoinRpcParams, SendBTCOptions } from "@core/types/types";
import { BitcoinRpcMethod } from "@enums/bitcoin";

export class BitcoinApi extends BaseApi {
	constructor() {
		super(BitcoinConfig.url);
		this.setHeaders({
			Authorization: `Basic ${encodeCredentials(
				BitcoinConfig.user,
				BitcoinConfig.pass,
			)}`,
		});
	}

	/**
	 * Sends a JSON-RPC request with a typed response.
	 * @param method The RPC method name (enum).
	 * @param params The ordered arguments for that method.
	 * @returns A typed object parsed from JSON (T).
	 */
	private async sendRpcRequest<T>(
		method: BitcoinRpcMethod,
		params: BitcoinRpcParams,
	): Promise<T> {
		const payload = {
			jsonrpc: "1.0",
			id: "playwright",
			method: method,
			params: params,
		};

		const requestParams = this.buildParameters("/", payload);
		const response: APIResponse = await this.post(requestParams);
		const data: T = (await response.json()) as T;
		return data;
	}

	/**
	 * Retrieves high-level blockchain info (e.g., chain, blocks).
	 * @returns A typed DTO object you can access (e.g. info.result.chain).
	 */
	public async getBlockchainInfo(): Promise<GetBlockchainInfoResponse> {
		return this.sendRpcRequest<GetBlockchainInfoResponse>(
			BitcoinRpcMethod.GET_BLOCKCHAIN_INFO,
			[],
		);
	}

	/**
	 * Returns the node wallet balance in BTC.
	 * @returns A typed DTO containing a numeric .result for the balance.
	 */
	public async getWalletBalance(): Promise<GetWalletBalanceResponse> {
		return this.sendRpcRequest<GetWalletBalanceResponse>(
			BitcoinRpcMethod.GET_WALLET_BALANCE,
			[],
		);
	}

	/**
	 * Sends BTC from the node's wallet to a specified address.
	 * @param toAddress The recipient's Bitcoin address (testnet).
	 * @param amount The amount of BTC to send, e.g. 0.0005.
	 * @param options Additional parameters controlling fee, RBF, etc.
	 * @returns A typed DTO containing the transaction ID (txid) in .result.
	 */
	public async sendBTC(
		toAddress: string,
		amount: number,
		options?: SendBTCOptions,
	): Promise<SendBTCResponse> {
		const paramArray: (string | number | boolean | undefined)[] = [
			toAddress,
			amount,
			options?.comment ?? "",
			options?.commentTo ?? "",
			options?.subtractFee ?? false,
			options?.replaceable ?? true,
			options?.confTarget,
			options?.estimateMode,
			options?.avoidReuse ?? false,
			options?.feeRate,
			options?.verbose,
		];

		return this.sendRpcRequest<SendBTCResponse>(
			BitcoinRpcMethod.SEND_TO_ADDRESS,
			paramArray,
		);
	}

	/**
	 * Retrieves details of a transaction by its txid.
	 * @param txid The transaction ID (hex string).
	 * @returns A typed DTO with transaction details (confirmations, fees, etc.).
	 */
	public async getTransaction(txid: string): Promise<GetTransactionResponse> {
		return this.sendRpcRequest<GetTransactionResponse>(
			BitcoinRpcMethod.GET_TRANSACTION,
			[txid],
		);
	}
}
