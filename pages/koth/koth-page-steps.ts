import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { KothPage } from "./koth-page";
import { expect } from "@playwright/test";

export class KothSteps extends BasePageStep<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}

	@step("Get KoTH points amount")
	public async getPointsAmount(): Promise<number> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.kothProfileCardPointsAmount,
			]);
		const text =
			await this.gamdomPage.map.kothProfileCardPointsAmount.textContent();
		return parseFloat(text ?? "0");
	}

	@step("Navigate to KoTH event and get points")
	public async navigateToKothEventAndGetPoints(
		kothEventPageEndpoint: string,
	): Promise<number> {
		await this.gamdomPage.navigateToKothEvent(kothEventPageEndpoint);
		await this.gamdomPage.assertThat().verifyKothEventPageIsDisplayed(
			kothEventPageEndpoint,
		);
		return this.getPointsAmount();
	}

	@step("Navigate to KoTH event and verify points increased")
	public async navigateToKothEventAndVerifyPointsIncreasedBy(
		kothEventPageEndpoint: string,
		initialPoints: number,
		expectedIncrease: number,
	): Promise<void> {
		await this.gamdomPage.navigateToKothEvent(kothEventPageEndpoint);
		await this.gamdomPage
			.assertThat()
			.verifyKothPointsIncreasedBy(initialPoints, expectedIncrease);
	}

	@step("Navigate to KOTH event by name")
	public async navigateToKothEventByName(
		kothEventName: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.kothMainTopbarTabsContainer,
		).toBeVisible();
		await this.gamdomPage.map
			.kothMainTopBarTabByName(kothEventName)
			.first()
			.click();
	}
}
