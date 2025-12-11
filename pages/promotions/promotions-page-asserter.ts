import { BaseAsserter } from "@base/base-asserter";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { step } from "decorators/step";
import { PromotionsPage } from "./promotions-page";
import { Locator } from "@playwright/test";
import { Timeout } from "@enums/timeout";

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

	@step("Wait for elements with page refresh")
	public async waitForElementsWithRefresh(
		elements: Locator[],
		errorMessage: string,
		timeout: number = Timeout.LONG,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				try {
					await this.checkElementsAreVisible(elements, timeout);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: errorMessage,
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Verify that the promotions page is loaded - v4")
	public async promotionsPageIsLoadedV4(): Promise<void> {
		await this.waitForElementsWithRefresh(
			[
				this.gamdomPage.map.promotionsPageTitleV4,
				this.gamdomPage.map.promotionsCategoriesFilterContainerV4,
			],
			"Promotions page was not loaded in time - required elements not visible",
		);
	}

	@step("Verify that the promotion is displayed in the promotions page - v4")
	public async promotionIsDisplayedInPromotionsPageV4(
		promotionTitle: string,
	): Promise<void> {
		await this.waitForElementsWithRefresh(
			[
				this.gamdomPage.map.promotionCardByPromotionTitleV4(
					promotionTitle,
				),
			],
			`Promotion "${promotionTitle}" was not displayed in the promotions page in time`,
		);
	}

	@step(
		"Verify that the promotion label is displayed for the correct promotion - v4",
	)
	public async promotionLabelForPromotionIsDisplayedV4(
		promotionTitle: string,
		label: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.promotionLabelForPromotionV4(
				promotionTitle,
				label,
			),
		]);
	}
}
