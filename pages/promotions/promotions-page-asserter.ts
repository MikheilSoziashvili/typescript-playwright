import { BaseAsserter } from "@base/base-asserter";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { step } from "decorators/step";
import { PromotionsPage } from "./promotions-page";

export class PromotionsPageAsserter extends BaseAsserter<PromotionsPage> {
	public constructor(page: PromotionsPage) {
		super(page);
	}

	@step("Verify that the promotions page is loaded")
	public async promotionsPageIsLoaded(): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				try {
					await this.checkElementsAreVisible(
						[
							this.gamdomPage.map.promotionsPageTitle,
							this.gamdomPage.map
								.promotionsCategoriesFilterContainer,
						],
						Timeout.LONG,
					);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage:
					"Promotions page was not loaded in time - required elements not visible",
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Verify that the promotion is displayed in the promotions page")
	public async promotionIsDisplayedInPromotionsPage(
		promotionTitle: string,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				try {
					await this.checkElementsAreVisible([
						this.gamdomPage.map.promotionCardByPromotionTitle(
							promotionTitle,
						),
					]);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Promotion "${promotionTitle}" was not displayed in the promotions page in time`,
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Verify that the promotion is not displayed in the promotions page")
	public async promotionIsNotDisplayedInPromotionsPage(
		promotionTitle: string,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				try {
					await this.checkElementsAreNotVisible([
						this.gamdomPage.map.promotionCardByPromotionTitle(
							promotionTitle,
						),
					]);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Promotion "${promotionTitle}" was still displayed in the promotions page after timeout`,
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}
}
