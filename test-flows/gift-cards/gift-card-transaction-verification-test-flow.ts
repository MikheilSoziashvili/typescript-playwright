import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { Currency } from "@enums/currencies";
import { DepositRewardType } from "@enums/deposit-reward-type";
import { TransactionState } from "@enums/transaction-states";

export class GiftCardTransactionVerificationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Verify claimed gift card transaction details")
	public async verifyClaimedDetails(user: BrowserUserSession): Promise<void> {
		await user.pages.transactionsPage.navigate();
		await this.openAndVerifyClaimedModal(user);
	}

	@testFlow("Verify claimed gift card transaction details after currency change")
	public async verifyCurrencyChangeDetails(
		user: BrowserUserSession,
		currency: Currency,
	): Promise<string> {
		await user.pages.transactionsPage.authenticatedHeader.changeCurrency(
			currency,
		);
		await user.pages.transactionsPage.navigate();
		return this.openAndVerifyClaimedModal(user);
	}

	@testFlow("Verify invalid code gift card transaction details")
	public async verifyInvalidCodeDetails(
		user: BrowserUserSession,
		fiatAmount: string,
	): Promise<void> {
		await user.pages.transactionsPage.navigate();
		await user.pages.transactionsPage.clickTransactionDetailsButtonByStatus(
			TransactionState.INVALID_CODE,
		);
		await user.pages.fiatDepositModal
			.assertThat()
			.fiatDepositDetailsAreDisplayed(
				fiatAmount,
				DepositRewardType.GIFTCARD,
				TransactionState.INVALID_CODE,
			);
	}

	private async openAndVerifyClaimedModal(
		user: BrowserUserSession,
	): Promise<string> {
		const fiatAmount =
			await user.pages.transactionsPage.getTransactionFiatAmount();
		await user.pages.transactionsPage.clickTransactionDetailsButton();
		await user.pages.fiatDepositModal
			.assertThat()
			.fiatDepositDetailsAreDisplayed(
				fiatAmount,
				DepositRewardType.GIFTCARD,
				TransactionState.CLAIMED,
			);
		await user.pages.fiatDepositModal.clickGotIt();
		return fiatAmount;
	}
}
