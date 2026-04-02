import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { Currency } from "@enums/currencies";
import { TestUserRole } from "@enums/test-user-roles";
import { GiftCardTransactionVerificationFlow } from "./gift-card-transaction-verification-test-flow";

export class GiftCardTransactionScenarioFlow extends BaseTestFlow {
	constructor(
		private readonly browserSessionManager: BrowserSessionManager,
		private readonly verificationFlow: GiftCardTransactionVerificationFlow,
	) {
		super();
	}

	@testFlow("Verify gift card fiat deposit modal transaction details")
	public async execute(params: { giftCardCode: string }): Promise<void> {
		const { giftCardCode } = params;

		const user = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
		);

		await user.pages.homePage.navigateToWallet();
		await user.pages.walletModal.steps().redeemPromoCode(giftCardCode);

		await this.verificationFlow.verifyClaimedDetails(user);

		const fiatAmountInNewCurrency =
			await this.verificationFlow.verifyCurrencyChangeDetails(
				user,
				Currency.PLN,
			);

		await user.pages.homePage.navigateToWallet();
		await user.pages.walletModal.steps().redeemPromoCode(giftCardCode);

		await this.verificationFlow.verifyInvalidCodeDetails(
			user,
			fiatAmountInNewCurrency,
		);
	}
}
