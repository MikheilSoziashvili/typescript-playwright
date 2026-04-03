import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { generateCustomUrl, getISODate } from "@core/utils/utils";
import { TestUserRole } from "@enums/test-user-roles";
import { GamdomDb } from "database/gamdom-db";
import { RandomDataSource } from "test-data/core/random-data-source";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";

export interface PromotionEndDateSetupResult {
	promotionName: string;
	customUrl: string;
	expectedFormat: RegExp;
}

export class PromotionEndDateSetupFlow extends BaseTestFlow {
	constructor(
		private readonly browserSessionManager: BrowserSessionManager,
		private readonly gamdomDb: GamdomDb,
		private readonly testDataRandom: RandomDataSource,
		private readonly testDataPredefined: PredefinedDataSource,
	) {
		super();
	}

	@testFlow("Setup promotion for end date format verification")
	public async setupPromotionForEndDateVerification(params: {
		promotionStatus: string;
		promotionsToDelete: string[];
	}): Promise<PromotionEndDateSetupResult> {
		const { promotionStatus, promotionsToDelete } = params;

		const adminSession = await this.browserSessionManager.loginAs(
			TestUserRole.ADMIN_PROMOTIONS_ADMIN,
			{ reuseContext: true },
		);
		const adminUserId =
			adminSession.getAuthenticatedUser().user.userId;

		const statusKey =
			promotionStatus.toUpperCase() as keyof typeof this.testDataPredefined.data.promotionEndDate;
		const dateConfig =
			this.testDataPredefined.data.promotionEndDate[statusKey];

		const promotionName =
			this.testDataRandom.data.promotionTitles.endDateFormatPromotionTitle(
				promotionStatus,
			);
		const customUrl = generateCustomUrl(promotionName);
		promotionsToDelete.push(promotionName);

		await this.gamdomDb.insertDefaultPromotion(
			promotionName,
			adminUserId,
			getISODate({ daysOffset: dateConfig.startDateOffset }),
			getISODate({ daysOffset: dateConfig.endDateOffset }),
			undefined,
			customUrl,
		);
		await this.gamdomDb.clearPromotionPriorityByTitle(promotionName);

		return {
			promotionName: promotionName,
			customUrl: customUrl,
			expectedFormat: dateConfig.expectedFormat,
		};
	}
}
