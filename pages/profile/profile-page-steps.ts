import { BasePageStep } from "@pages/base/base-page-step";
import { logger } from "@logger/logger";
import { ProfilePage } from "./profile-page";
import { Page } from "@playwright/test";
import { MailinatorApi } from "@api/mailinator-api";

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
	): Promise<void> {
		// Poll for the new verification email
		const messages = await mailinatorApi.pollForMessages(domain, inbox);
		const verificationEmailId = messages[0].id;

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
		await this.gamdomPage.assertThat().verifyButtonNotVisible();
	}
}
