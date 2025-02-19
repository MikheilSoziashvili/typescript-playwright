import { BaseAsserter } from "@base/base-asserter";
import { PlinkoGamePage } from "./plinko-game-page";
import { step } from "decorators/step";
import { expect, TestInfo } from "@playwright/test";

export class PlinkoGamePageAsserter extends BaseAsserter<PlinkoGamePage> {
	public constructor(page: PlinkoGamePage) {
		super(page);
	}

	@step("Sign In button is vissible")
	async signInButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.signInButton).toBeVisible();
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
}
