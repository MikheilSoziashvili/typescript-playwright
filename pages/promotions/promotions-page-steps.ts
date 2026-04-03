import { BasePageStep } from "@pages/base/base-page-step";
import { PromotionsPage } from "./promotions-page";
import { step } from "decorators/step";
import { GamdomDb } from "database/gamdom-db";
import { PromotionLabels } from "@enums/promotion-labels";
import { getISODate } from "@core/utils/utils";
import { PromotionIsVipCategories } from "@enums/promotion-is-vip-categories";

export class PromotionsPageSteps extends BasePageStep<PromotionsPage> {
	private readonly gamdomDb: GamdomDb;

	public constructor(gamdomPage: PromotionsPage) {
		super(gamdomPage);
		this.gamdomDb = new GamdomDb();
	}

	@step("Navigate to promotions page and verify it is loaded")
	public async navigateAndVerifyPageIsLoaded(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().promotionsPageIsLoaded();
	}

	@step("Activate and make duplicated promotions visible")
	public async activateAndSetVisibleDuplicatedPromotions(
		duplicatedPromotionTitle: string,
		duplicatedPromotionTitleSecond: string,
	): Promise<void> {
		for (const title of [
			duplicatedPromotionTitle,
			duplicatedPromotionTitleSecond,
		]) {
			await this.gamdomDb.activatePromotionByTitle(title);
			await this.gamdomDb.setPromotionVisibleByTitle(title, true);
		}
	}

	@step("Verify duplicated promotions are displayed in the promotions page")
	public async verifyDuplicatedPromotionsAreDisplayed(
		duplicatedPromotionTitle: string,
		duplicatedPromotionTitleSecond: string,
	): Promise<void> {
		for (const title of [
			duplicatedPromotionTitle,
			duplicatedPromotionTitleSecond,
		]) {
			await this.gamdomPage
				.assertThat()
				.promotionIsDisplayedInPromotionsPage(title);
		}
	}

	@step("Verify duplicated promotions visibility for correct user")
	public async verifyDuplicatedPromotionsVisibilityForCorrectUser(
		isForVip: PromotionIsVipCategories,
		regularUserPage: PromotionsPage,
		adminUserPage: PromotionsPage,
		duplicatedPromotionTitle: string,
		duplicatedPromotionTitleSecond: string,
	): Promise<void> {
		const pageToUse =
			isForVip === PromotionIsVipCategories.FOR_VIP
				? regularUserPage
				: adminUserPage;

		await pageToUse.navigate();
		await pageToUse.assertThat().promotionsPageIsLoaded();

		await pageToUse
			.steps()
			.verifyDuplicatedPromotionsAreDisplayed(
				duplicatedPromotionTitle,
				duplicatedPromotionTitleSecond,
			);
	}

	@step("Insert helper promotion for archived scenarios")
	public async insertHelperPromotion(
		helperTitle: string,
		userId: number,
		label: string,
	): Promise<void> {
		if (label.toUpperCase() !== PromotionLabels.ARCHIVE.toUpperCase()) {
			return;
		}

		const startDate = getISODate({ daysOffset: -3 });
		const endDate = getISODate({ daysOffset: 5 });

		await this.gamdomDb.insertDefaultPromotion(
			helperTitle,
			userId,
			startDate,
			endDate,
		);
	}
}
