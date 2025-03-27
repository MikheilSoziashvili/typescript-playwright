import { BaseAsserter } from "@base/base-asserter";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePage } from "./plinko-game-page";

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
}
