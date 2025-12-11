import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { TransactionDetailsModalMap } from "./transaction-details-modal-map";
import { TransactionDetailsModalSteps } from "./transaction-details-modal-steps";
import { TransactionDetailsModalAsserter } from "./transaction-details-modal-asserter";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { CryptoTicker } from "@enums/cryptocurrencies";

export class TransactionDetailsModal extends BasePage<TransactionDetailsModalMap> {
	constructor(page: Page) {
		super(page, new TransactionDetailsModalMap(page));
	}

	public assertThat(): TransactionDetailsModalAsserter {
		return new TransactionDetailsModalAsserter(this);
	}

	public steps(): TransactionDetailsModalSteps {
		return new TransactionDetailsModalSteps(this);
	}

	@step("Get deposit amount in crypto value")
	public async getDepositAmountInCryptoValue(
		cryptoCurrency: CryptoTicker,
	): Promise<string> {
		return this.map.depositAmountIn(cryptoCurrency).inputValue();
	}

	@step("Get withdrawal amount in USD")
	public async getWithdrawalAmountInUsd(): Promise<string> {
		return this.map.withdrawalAmountInUsd.inputValue();
	}

	@step("Get network transaction fee in USD")
	public async getNetworkTransactionFee(): Promise<string> {
		return this.map.networkTransactionFee.inputValue();
	}

	@step("Get network transaction speed")
	public async getNetworkTransactionSpeed(): Promise<string> {
		return this.map.networkProcessingSpeed.inputValue();
	}

	@step("Get blockchain transaction id")
	public async getBlockchainTransactionId(): Promise<string> {
		const href = await this.map.blockchainTransactionLink.getAttribute(
			Attributes.HREF,
		);
		const parts = href?.split("/") ?? [];
		const transactionId = parts.pop();

		if (!transactionId) {
			throw new Error("Transaction ID could not be extracted from href.");
		}

		return transactionId;
	}
}
