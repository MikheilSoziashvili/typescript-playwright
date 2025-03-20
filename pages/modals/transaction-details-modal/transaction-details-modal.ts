import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { TransactionDetailsModalMap } from "./transaction-details-modal-map";
import { TransactionDetailsModalSteps } from "./transaction-details-modal-steps";
import { TransactionDetailsModalAsserter } from "./transaction-details-modal-asserter";
import { step } from "decorators/step";

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

	@step()
	public async getDepositAmountInBTCValue(): Promise<string> {
		return this.map.depositAmountInBTC.inputValue();
	}
}
