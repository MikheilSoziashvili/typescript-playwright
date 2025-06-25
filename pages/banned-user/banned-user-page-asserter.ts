import { expect, TestInfo } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { BannedUserPage } from "./banned-user-page";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";

export class BannedUserPageAsserter extends BaseAsserter<BannedUserPage> {
	public constructor(page: BannedUserPage) {
		super(page);
	}

	@step("Verify banned title is displayed")
	public async isBannedTitleDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.restrictionTitle).toHaveText(
			"Your account has been Banned!",
		);
	}

	@step("Verify banned reason is displayed")
	public async isBannedReasonDisplayed(reason?: string): Promise<void> {
		const bannedReason = reason || "Banned";
		await expect(this.gamdomPage.map.bannedReason).toHaveText(
			`Reason: ${bannedReason}`,
		);
	}

	@step("Verify social media link is correct")
	public async isSocialMediaLinkCorrect(
		socialMedia: string,
		expectedURL: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.socialMediaFooterLinkByPlaceholder(socialMedia),
		).toHaveAttribute(Attributes.HREF, expectedURL);
	}

	@step("Verify footer social media icon visual appearance")
	public async footerSocialMediaIconVisualCorrect(
		testInfo: TestInfo,
		socialMedia: string,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.socialMediaFooterIconByPlaceholder(socialMedia),
		);
	}
}
