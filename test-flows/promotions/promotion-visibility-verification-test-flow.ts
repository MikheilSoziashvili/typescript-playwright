import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";

export class PromotionVisibilityVerificationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Verify promotion visibility")
	public async verifyPromotionVisibility(params: {
		user: BrowserUserSession;
		promotionName: string;
		customUrl: string;
		shouldBeVisible: boolean;
	}): Promise<void> {
		const { user, promotionName, customUrl, shouldBeVisible } = params;
		await user.pages.promotionsPage.navigate();
		if (shouldBeVisible) {
			await user.pages.promotionsPage
				.assertThat()
				.promotionIsDisplayedInPromotionsPage(promotionName);
		} else {
			await user.pages.promotionsPage
				.assertThat()
				.promotionIsNotDisplayedInPromotionsPage(promotionName);
		}
		await user.pages.promotionPage.navigateToPromotion(customUrl);
	}
}
