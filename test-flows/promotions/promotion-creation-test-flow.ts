import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { PromotionTestData } from "@dtos/test-data";
import { VisibilityOptions } from "@enums/visibility-options";

export class PromotionCreationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Create and publish promotion")
	public async createAndPublishPromotion(params: {
		adminUser: BrowserUserSession;
		promotionTestData: PromotionTestData;
		promotionName: string;
		visibilityOption?: VisibilityOptions;
	}): Promise<void> {
		const {
			adminUser,
			promotionTestData,
			promotionName,
			visibilityOption = VisibilityOptions.VISIBLE,
		} = params;

		await adminUser.pages.promotionAdminPage.navigate();
		await adminUser.pages.promotionAdminPage.clickCreateNewPromotionButton();
		await adminUser.pages.promotionsModal
			.steps()
			.fillPromotionSuccessfully(promotionTestData);
		await adminUser.pages.promotionAdminPage
			.steps()
			.checkPromotionIsDisplayedInPromotionsTable(promotionName);
		await adminUser.pages.promotionAdminPage.setPromotionVisibility(
			promotionName,
			visibilityOption,
		);
	}
}
