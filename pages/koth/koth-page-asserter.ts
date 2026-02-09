import { GamdomApi } from "@api/gamdom-api";
import { INITIAL_TIMER } from "@constants/timers";
import { formatCurrency, waitForSeconds, waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { expect, TestInfo } from "playwright/test";
import { KothPage } from "./koth-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class KothAsserter extends BaseAsserter<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}

	@step("Koth banner visual correct")
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

	@step("Verify koth banner currency is centered")
	public async verifyKothBannerCurrencyIsCentered(): Promise<void> {
		const currencyContainer = this.gamdomPage.map.kothBannerCurrencyAmount;
		const initialX = await this.gamdomPage.getKothBannerCurrencyXPosition();

		await this.verifyElementIsCentered(
			currencyContainer,
			initialX,
			"KOTH Banner Currency",
		);
	}

	@step("Verify koth banner timer is centered")
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

	@step("Verify koth url is")
	public async verifyKothUrlIs(
		expectedUrl: string,
		gamdomApi: GamdomApi,
		cookie: string,
	): Promise<void> {
		const lastKothEventName = await gamdomApi.getKothEventName({
			Cookie: cookie,
		});
		const formattedExpectedUrl =
			`${expectedUrl}/${lastKothEventName}`.toLowerCase();

		await this.waitForAndVerifyCurrentUrlIs(formattedExpectedUrl);
	}

	@step("Verify koth event page is displayed")
	public async verifyKothEventPageIsDisplayed(
		kothPageEndpoint: string,
	): Promise<void> {
		await this.waitForAndVerifyCurrentUrlIs(kothPageEndpoint);
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.kothGameContainer,
				this.gamdomPage.map.kothProfileCardLeftContainer,
				this.gamdomPage.map.kothUsersCardRightContainer,
			],
			Timeout.MAX,
		);
	}

	@step("Verify KoTH points increased by expected amount")
	public async verifyKothPointsIncreasedBy(
		initialPoints: number,
		expectedIncrease: number,
	): Promise<void> {
		const expectedTotal = parseFloat(
			(initialPoints + expectedIncrease).toFixed(2),
		);

		await this.checkElementsHaveText(
			[
				{
					locator:
						this.gamdomPage.map.kothProfileCardPointsAmount,
					expectedText: expectedTotal.toFixed(2),
				},
			],
			Timeout.MAX,
		);
	}

	@step("Verify koth wagger amount profile card")
	public async verifyKothWaggerAmountProfileCard(
		expectedAmount: number,
	): Promise<void> {
		const formattedAmount = formatCurrency(expectedAmount);

		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await waitForSeconds(2);
				await expect(
					this.gamdomPage.map.kothProfileCardWageredAmount,
				).toBeVisible();
				const actualAmount =
					await this.gamdomPage.map.kothProfileCardWageredAmount.textContent();
				return actualAmount === formattedAmount;
			},
			{
				errorMessage: `KOTH wagered amount did not match expected value. Expected: ${formattedAmount}`,
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Verify user KOTH wager amount in right table")
	public async verifyUserKothWaggerAmountRightTable(
		expectedAmount: number,
		username: string,
	): Promise<void> {
		const formattedAmount = formatCurrency(expectedAmount);

		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await waitForSeconds(2);
				await expect
					.poll(async () => {
						await this.gamdomPage.map.currentUserMarkKothUsersCardRightContainer.scrollIntoViewIfNeeded();
						return this.gamdomPage.map.currentUserMarkKothUsersCardRightContainer.isVisible();
					})
					.toBe(true);

				const userWageredAmountElement =
					this.gamdomPage.map.getUserWageredAmountUsersCardsRightContainerByUsername(
						username,
					);
				await expect(userWageredAmountElement).toBeVisible();
				const actualAmount =
					await userWageredAmountElement.textContent();
				return actualAmount === formattedAmount;
			},
			{
				errorMessage: `KOTH wagered amount for user '${username}' did not match expected value. Expected: ${formattedAmount}`,
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: TimeoutSeconds.NINETY,
			},
		);
	}
}
