import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { VipUserStatus } from "@enums/vip-user-statuses";
import { GamdomDb } from "database/gamdom-db";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";
import { PromotionIsVipCategories } from "@enums/promotion-is-vip-categories";
import { generateCustomUrl } from "@core/utils/utils";
import { RandomDataSource } from "test-data/core/random-data-source";
import { ObjectDataSource } from "test-data/core/object-data-source";
import { PromotionTestData } from "@dtos/test-data";

export interface PromotionSetupResult {
	promotionName: string;
	customUrl: string;
	promotionTestData: PromotionTestData;
}

export class PromotionSetupFlow extends BaseTestFlow {
	constructor(
		private readonly gamdomDb: GamdomDb,
		private readonly testDataRandom: RandomDataSource,
		private readonly testDataObject: ObjectDataSource,
	) {
		super();
	}

	@testFlow("Setup and prepare promotion data")
	public async setupPromotionData(params: {
		adminUser: BrowserUserSession;
		regularUser: BrowserUserSession;
		category: PromotionCategories;
		subCategory: PromotionSubStatuses;
		isForVip: PromotionIsVipCategories;
		vipUserStatus?: VipUserStatus;
		promotionsToDelete: string[];
	}): Promise<PromotionSetupResult> {
		const {
			adminUser,
			regularUser,
			category,
			subCategory,
			isForVip,
			vipUserStatus,
			promotionsToDelete,
		} = params;

		if (vipUserStatus) {
			await this.gamdomDb.insertVipUser(
				regularUser.getAuthenticatedUser().user.userId,
				adminUser.getAuthenticatedUser().user.userId,
				vipUserStatus,
			);
		}
		const promotionName =
			this.testDataRandom.data.promotionTitles.promotionTitle(
				category,
				subCategory,
				isForVip,
			);

		promotionsToDelete.push(promotionName);
		const customUrl = generateCustomUrl(promotionName);

		const promotionTestData = this.testDataObject.promotions.build({
			title: promotionName,
			customUrl: customUrl,
			isForVip: isForVip,
			promotionCategory: category,
			promotionSubCategory: subCategory,
		});

		return {
			promotionName,
			customUrl,
			promotionTestData,
		};
	}
}
