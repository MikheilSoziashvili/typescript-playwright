import { BaseAsserter } from "@base/base-asserter";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { expect, Locator, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePage } from "./plinko-game-page";
import { Timeout } from "@enums/timeout";
import { IntervalMs } from "@enums/interval-millisecond";

export class PlinkoGamePageAsserter extends BaseAsserter<PlinkoGamePage> {
	public constructor(page: PlinkoGamePage) {
		super(page);
	}

	@step("Sign In button is vissible")
	async signInButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.signInButton).toHaveText("Sign in");
	}

	@step("Sign In modal is visible")
	async signInModalVisualIsCorrect(testInfo: TestInfo): Promise<void> {
		await expect(this.gamdomPage.map.signInModal).toBeVisible();
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.signInModal,
			{
				toHaveScreenshotOptions: {
					mask: [
						this.gamdomPage.map.usernameField,
						this.gamdomPage.map.passwordField,
						this.gamdomPage.map.partnersSlider,
					],
				},
			},
		);
	}

	@step("Drop ball button is displayed")
	async dropBallButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.signInButton).toHaveText("Drop ball");
	}

	@step("Verify that the left bet panel is displayed")
	async leftBetPanelIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.leftBetPanelContainer,
		]);
	}

	@step(
		"Verify that the number of bets input matches the remaining bets label",
	)
	async numberOfBetsInputAndRemainingBetsLabelAreEqual(): Promise<void> {
		const numberOfBets = await this.gamdomPage.getNumberOfBetsInput();
		const remainingBets = await this.gamdomPage.getRemainingBetsCount();

		expect(numberOfBets).toEqual(remainingBets);
	}

	@step("Verify that the in-game toast message is displayed")
	async inGameToastIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.plinkoToastMessageContainer,
		]);
	}

	@step("Verify that the in-game toast title matches the expected value")
	async inGameToastTitleIs(toastTitle: string): Promise<void> {
		await expect(this.gamdomPage.map.plinkoToastMessageTitle).toHaveText(
			toastTitle,
		);
	}

	@step("Verify that the in-game toast subtitle matches the expected value")
	async inGameToastSubTitleIs(toastSubTitle: string): Promise<void> {
		await expect(this.gamdomPage.map.plinkoToastMessageSubTitle).toHaveText(
			toastSubTitle,
		);
	}

	@step(
		"Verify that the autobet finish in-game toast is displayed with correct title and subtitle",
	)
	async autobetFinishInGameToastIsDisplayed(): Promise<void> {
		await this.inGameToastIsDisplayed();
		await this.inGameToastTitleIs(ToastTitle.SUCCESS);
		await this.inGameToastSubTitleIs(ToastSubTitle.AUTOBET_FINISHED);
	}

	@step("Verify that the Stop Autobet button is displayed")
	async stopAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.stopAutobetButton,
		]);
	}

	@step("Verify that the Start Autobet button is displayed")
	async starAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startAutobetButton,
		]);
	}

	@step("Verify rows slider inactive")
	async verifyRowsSliderInactive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.betRowsSliderInput,
			BooleanValueString.TRUE,
			timeout,
		);
	}

	@step("Verify rows slider active")
	async verifyRowsSliderActive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.betRowsSliderInput,
			BooleanValueString.FALSE,
			timeout,
		);
	}

	@step("Verify risk slider inactive")
	async verifyRiskSliderInactive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.riskRowsSliderInput,
			BooleanValueString.TRUE,
			timeout,
		);
	}

	@step("Verify risk slider active")
	async verifyRiskSliderActive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.riskRowsSliderInput,
			BooleanValueString.FALSE,
			timeout,
		);
	}

	@step("Verify rows and risk sliders inactive")
	async verifyRowsAndRiskSlidersInactive(timeout?: number): Promise<void> {
		await this.verifyRowsSliderInactive(timeout);
		await this.verifyRiskSliderInactive(timeout);
	}

	@step("Verify rows and risk sliders active")
	async verifyRowsAndRiskSlidersActive(timeout?: number): Promise<void> {
		await this.verifyRowsSliderActive(timeout);
		await this.verifyRiskSliderActive(timeout);
	}

	@step("Verify slider value")
	async verifySliderValue(
		sliderContainer: Locator,
		expectedValue: number,
		tolerance = 0,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getSliderValue(
			sliderContainer,
		);

		if (tolerance > 0) {
			expect(actualValue).toBeGreaterThanOrEqual(
				expectedValue - tolerance,
			);
			expect(actualValue).toBeLessThanOrEqual(expectedValue + tolerance);
		} else {
			expect(actualValue).toBe(expectedValue);
		}
	}

	@step("Verify rows slider value")
	async verifyRowsSliderValue(
		expectedValue: number,
		tolerance = 0,
	): Promise<void> {
		await this.verifySliderValue(
			this.gamdomPage.map.betRowsSliderContainer,
			expectedValue,
			tolerance,
		);
	}

	@step("Verify risk slider value")
	async verifyRiskSliderValue(
		expectedValue: number,
		tolerance = 0,
	): Promise<void> {
		await this.verifySliderValue(
			this.gamdomPage.map.riskRowsSliderContainer,
			expectedValue,
			tolerance,
		);
	}

	@step("Verify in game history is displayed")
	async verifyInGameHistoryIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.inGameHistoryContainer,
		]);
	}

	@step("Verify in game chips history button is displayed")
	async verifyInGameChipsHistoryButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.inGameChipsHistoryButton,
		]);
	}

	@step("Verify balance and 'Your Bet' updated simultaneously")
	async balanceAndYourBetUpdatedSimultaneosly(
		initialAccountBalance: number,
		initialYourBetBalance: number,
	): Promise<void> {
		await expect
			.poll(
				async () => {
					const currentAccountBalance =
						await this.userBalanceHandler.walletBalanceInUsd();
					const currentYourBetBalance =
						await this.gamdomPage.getYourBetValue();

					return {
						balanceChanged:
							currentAccountBalance !== initialAccountBalance,
						yourBetChanged:
							currentYourBetBalance !== initialYourBetBalance,
						valuesMatch:
							currentAccountBalance === currentYourBetBalance,
					};
				},
				{
					timeout: Timeout.MAX,
					intervals: [IntervalMs.SHORT],
				},
			)
			.toMatchObject({
				balanceChanged: true,
				yourBetChanged: true,
				valuesMatch: true,
			});
	}
}
