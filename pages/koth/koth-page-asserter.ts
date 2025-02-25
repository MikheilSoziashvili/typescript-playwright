import { BaseAsserter } from "@pages/base/base-asserter";
import { KothPage } from "./koth-page";
import { step } from "decorators/step";
import { TestInfo } from "playwright/test";

export class KothAsserter extends BaseAsserter<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}

	@step()
	public async kothBannerVisualCorrect(testInfo: TestInfo): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.kothBannerImage,
			{
				toHaveScreenshotOptions: {
					mask: [
						this.gamdomPage.map.kothBannerCurrencyAmount,
						this.gamdomPage.map.kothBannerTimerContainer,
					],
				},
			},
		);
	}

	@step()
	public async verifyKothBannerCurrencyIsCentered(): Promise<void> {
		const currencyContainer = this.gamdomPage.map.kothBannerCurrencyAmount;
		const initialX = await this.gamdomPage.getKothBannerCurrencyXPosition();

		await this.verifyElementIsCentered(
			currencyContainer,
			initialX,
			"KOTH Banner Currency",
		);
	}

	@step()
	public async verifyKothBannerTimerIsCentered(): Promise<void> {
		const timerContainer = this.gamdomPage.map.kothBannerTimerContainer;
		const initialX = await this.gamdomPage.getKothBannerTimerXPosition();

		await this.verifyElementIsCentered(
			timerContainer,
			initialX,
			"KOTH Banner Timer",
		);
	}
}
