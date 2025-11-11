import { BaseApi } from "../../../api/base-api";
import { APIResponse } from "@playwright/test";
import { encodeCredentials } from "@core/utils/utils";
import { UtxoRpcParams, SendOptions, UtxoNodeConfig } from "@core/types/types";
import { UtxoRpcMethod } from "@enums/crypto/utxo";
import { GetBlockchainInfoResponse } from "@dtos/responses/bitcoin-api/get-blockchain-info-response";
import { GetTransactionResponse } from "@dtos/responses/bitcoin-api/get-transaction-response";
import { GetWalletBalanceResponse } from "@dtos/responses/bitcoin-api/get-wallet-balance-response";
import { SendResponse } from "@dtos/responses/bitcoin-api/send-response";
import { BitcoinConfig, LitecoinConfig } from "configuration";

/**
 * @class UtxoNodeClient
 * @description
 * Lightweight RPC client for **UTXO-based blockchains** that implement the
 * Bitcoin Core JSON-RPC interface (Bitcoin, Litecoin, Dogecoin).
 *
 * Use the static factories for zero-arg construction in fixtures:
 * - {@link UtxoNodeClient.bitcoin} → uses `BitcoinConfig`
 * - {@link UtxoNodeClient.litecoin} → uses `LitecoinConfig`
 *
 * Methods provided:
 * - `getBlockchainInfo()` – chain/height/basic sync info
 * - `getWalletBalance()` – node wallet balance (native units)
 * - `sendToAddress()` – create on-chain payment
 * - `getTransaction()` – fetch tx details by txid
 */
export class UtxoNodeClient extends BaseApi {
	/** Prefer the static factories; ctor kept private to enforce config sources. */
	private constructor({ url, user, pass }: UtxoNodeConfig) {
		super(url);

		this.setHeaders({
			Authorization: `Basic ${encodeCredentials(user, pass)}`,
		});
	}

	/** Create a client wired to the **Bitcoin** node config. */
	public static bitcoin(): UtxoNodeClient {
		return new UtxoNodeClient({
			url: BitcoinConfig.url,
			user: BitcoinConfig.user,
			pass: BitcoinConfig.pass,
		});
	}

	/** Create a client wired to the **Litecoin** node config. */
	public static litecoin(): UtxoNodeClient {
		return new UtxoNodeClient({
			url: LitecoinConfig.url,
			user: LitecoinConfig.user,
			pass: LitecoinConfig.pass,
		});
	}

	/**
	 * Sends a raw Bitcoin-style JSON-RPC request.
	 *
	 * @template T Expected DTO type of the RPC response
	 * @param method JSON-RPC method name (see {@link UtxoRpcMethod})
	 * @param params Ordered parameters for the RPC call
	 * @returns Typed RPC response matching `<T>`
	 */
	private async sendRpcRequest<T>(
		method: UtxoRpcMethod,
		params: UtxoRpcParams,
	): Promise<T> {
		const requestParams = this.buildParameters("/", {
			jsonrpc: "1.0",
			id: "playwright",
			method: method,
			params: params,
		});

		const response: APIResponse = await this.post(requestParams);
		return (await response.json()) as T;
	}

	/**
	 * Retrieves basic blockchain info:
	 *  - chain (main/test/regtest)
	 *  - current block height
	 *  - headers / blocks synchronization status
	 *
	 * @returns DTO containing `.result.chain` and `.result.blocks`
	 */
	public async getBlockchainInfo(): Promise<GetBlockchainInfoResponse> {
		return this.sendRpcRequest<GetBlockchainInfoResponse>(
			UtxoRpcMethod.GET_BLOCKCHAIN_INFO,
			[],
		);
	}

	/**
	 * Returns wallet balance from the node.
	 * Units depend on node configuration (BTC or LTC).
	 *
	 * @returns A typed DTO with numerical `.result` balance
	 */
	public async getWalletBalance(): Promise<GetWalletBalanceResponse> {
		return this.sendRpcRequest(UtxoRpcMethod.GET_WALLET_BALANCE, []);
	}

	/**
	 * Sends funds from the node wallet to an external address.
	 *
	 * @param address Destination blockchain address
	 * @param amount Amount in native chain units (BTC/LTC)
	 * @param options Optional config (subtract fees, RBF, target confs, etc.)
	 * @returns DTO with `.result` containing the transaction ID
	 */
	public async sendToAddress(
		address: string,
		amount: number,
		options?: SendOptions,
	): Promise<SendResponse> {
		return this.sendRpcRequest<SendResponse>(
			UtxoRpcMethod.SEND_TO_ADDRESS,
			[
				address,
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
			],
		);
	}

	/**
	 * Fetches details of a transaction by its txid.
	 * Same RPC method name for BTC, LTC, DOGE.
	 *
	 * @param txid Transaction ID in hex format
	 * @returns DTO including confirmations, fee, input/output info
	 */
	public async getTransaction(txid: string): Promise<GetTransactionResponse> {
		return this.sendRpcRequest<GetTransactionResponse>(
			UtxoRpcMethod.GET_TRANSACTION,
			[txid],
		);
	}
}
