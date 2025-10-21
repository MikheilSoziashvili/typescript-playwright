import { BasePageStep } from "@pages/base/base-page-step";
import { PromotionsPage } from "./promotions-page";
import { step } from "decorators/step";
import { GamdomDb } from "database/gamdom-db";

export class PromotionsPageSteps extends BasePageStep<PromotionsPage> {
	private readonly gamdomDb: GamdomDb;

	public constructor(gamdomPage: PromotionsPage) {
		super(gamdomPage);
		this.gamdomDb = new GamdomDb();
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
}
