import { BaseTestFlow, testFlow } from "@test-flows";
import { PromotionSetupFlow } from "./promotion-setup-test-flow";
import { PromotionCreationFlow } from "./promotion-creation-test-flow";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";
import { PromotionIsVipCategories } from "@enums/promotion-is-vip-categories";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { VisibilityOptions } from "@enums/visibility-options";

export interface PromotionSetupAndCreationResult {
	promotionName: string;
	customUrl: string;
}

export class PromotionTestFlow extends BaseTestFlow {
	constructor(
		private readonly setupFlow: PromotionSetupFlow,
		private readonly creationFlow: PromotionCreationFlow,
	) {
		super();
	}

	@testFlow("Setup and create promotion")
	public async setupAndCreatePromotion(params: {
		adminUser: BrowserUserSession;
		regularUser: BrowserUserSession;
		category: PromotionCategories;
		subCategory: PromotionSubStatuses;
		isForVip: PromotionIsVipCategories;
		vipUserStatus?: VipUserStatus;
		promotionsToDelete: string[];
		visibilityOption?: VisibilityOptions;
	}): Promise<PromotionSetupAndCreationResult> {
		const {
			adminUser,
			regularUser,
			category,
			subCategory,
			isForVip,
			vipUserStatus,
			promotionsToDelete,
			visibilityOption,
		} = params;

		const setupResult = await this.setupFlow.setupPromotionData({
			adminUser: adminUser,
			regularUser: regularUser,
			category: category,
			subCategory: subCategory,
			isForVip: isForVip,
			vipUserStatus: vipUserStatus,
			promotionsToDelete: promotionsToDelete,
		});
		await this.creationFlow.createAndPublishPromotion({
			adminUser: adminUser,
			promotionTestData: setupResult.promotionTestData,
			promotionName: setupResult.promotionName,
			visibilityOption: visibilityOption,
		});

		return {
			promotionName: setupResult.promotionName,
			customUrl: setupResult.customUrl,
		};
	}
}
