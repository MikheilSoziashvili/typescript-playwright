import { GamdomApi } from "@api/gamdom-api";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { expect, TestInfo } from "playwright/test";
import { KothPage } from "./koth-page";
import { INITIAL_TIMER } from "@constants/timers";
import { Timeout } from "@enums/timeout";

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

		await expect
			.poll(
				async () => {
					const timerText = await timerContainer.textContent();
					return timerText;
				},
				{
					message: `Waiting for KOTH timer to update from ${INITIAL_TIMER} to a new value`,
					timeout: Timeout.MEDIUM,
				},
			)
			.not.toBe(INITIAL_TIMER);

		const initialX = await this.gamdomPage.getKothBannerTimerXPosition();

		await this.verifyElementIsCentered(
			timerContainer,
			initialX,
			"KOTH Banner Timer",
		);
	}

	@step()
	public async verifyKothUrlIs(
		expectedUrl: string,
		gamdomApi: GamdomApi,
		cookie: string,
	): Promise<void> {
		const lastKothEventName = await gamdomApi.getLastKothEventName({
			Cookie: cookie,
		});
		const formattedExpectedUrl =
			`${expectedUrl}/${lastKothEventName}`.toLowerCase();

		await this.waitForAndVerifyCurrentUrlIs(formattedExpectedUrl);
	}
}
