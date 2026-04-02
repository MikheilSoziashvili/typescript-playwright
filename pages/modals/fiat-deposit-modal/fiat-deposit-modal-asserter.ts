import { BaseAsserter } from "@base/base-asserter";
import { DepositRewardType } from "@enums/deposit-reward-type";
import { TransactionState } from "@enums/transaction-states";
import { step } from "decorators/step";
import { FiatDepositModal } from "./fiat-deposit-modal";

export class FiatDepositModalAsserter extends BaseAsserter<FiatDepositModal> {
	public constructor(page: FiatDepositModal) {
		super(page);
	}

	@step("Fiat deposit modal shows correct details")
	public async fiatDepositDetailsAreDisplayed(
		depositAmount: string,
		provider: DepositRewardType,
		status: TransactionState,
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.container]);
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.depositAmountInput,
				expectedValue: depositAmount,
			},
			{
				locator: this.gamdomPage.map.providerInput,
				expectedValue: provider,
			},
		]);
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.statusText,
				expectedText: status,
			},
		]);
	}
}
