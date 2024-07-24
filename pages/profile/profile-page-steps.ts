import { BasePageStep } from "@pages/base/base-page-step";
import { logger } from "@logger/logger";
import { ProfilePage } from "./profile-page";
import { Page } from "@playwright/test";
import { MailinatorApi } from "@api/mailinator-api";
import { Timeout } from "@enums/timeout";

export class ProfilePageSteps extends BasePageStep<ProfilePage> {
	public constructor(gamdomPage: ProfilePage) {
		super(gamdomPage);
	}

	private async setHideUserStatisticsMode(): Promise<void> {
		if (!(await this.gamdomPage.map.hideStatisticsToggle.isChecked())) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already enabled");
		}
	}

	private async setShowUserStatisticsMode(): Promise<void> {
		if (await this.gamdomPage.map.hideStatisticsToggle.isChecked()) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already disabled");
		}
	}

	public async toggleUserStatisticsMode(toggle: "on" | "off"): Promise<void> {
		if (toggle === "on") {
			await this.setHideUserStatisticsMode();
		} else {
			await this.setShowUserStatisticsMode();
		}
	}

	public async completeVerificationFlow(): Promise<void> {
		await this.gamdomPage.map.verifyButton.click();
		await this.gamdomPage.map.continueVerificationButton.click();
	}

	public async verifyEmailAndCheckProfile(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex }: { messageIndex: number },
		timeout = Timeout.LONG,
		interval = Timeout.EXTRA_SHORT,
	): Promise<void> {
		// Poll for the verification email
		const message = await mailinatorApi.pollForMessages(
			domain,
			inbox,
			timeout,
			interval,
			messageIndex,
		);
		const verificationEmailId = message.id;

		// Fetch the email links and navigate to the new verification link
		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			verificationEmailId,
		);
		const verificationLink = emailLinks.links[0];

		await page.goto(verificationLink);

		// Assert account is already verified
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().assertVerifyButtonNotVisible();
	}

	public async changeEmail(email: string): Promise<void> {
		await this.gamdomPage.map.changeEmailButton.click();
		await this.gamdomPage.map.changeEmailInput.fill(email);
		await this.gamdomPage.map.saveEmailButton.click();
		await this.gamdomPage.continueModal.assertThat().isDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
		await this.gamdomPage.assertThat().assertChangeEmailButtonVisible();
	}
}
