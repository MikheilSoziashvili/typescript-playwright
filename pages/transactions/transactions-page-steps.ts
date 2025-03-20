import { BasePageStep } from "@pages/base/base-page-step";
import { TransactionsPage } from "./transactions-page";
import { step } from "decorators/step";

export class TransactionsSteps extends BasePageStep<TransactionsPage> {
	public constructor(page: TransactionsPage) {
		super(page);
	}

	@step()
	public async verifyDepositTransactionIsComplete(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.openDepositsTab();
		await this.gamdomPage.assertThat().assertTransactionStatusIsComplete();
	}
}
