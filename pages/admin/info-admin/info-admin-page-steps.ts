import { BasePageStep } from "@pages/base/base-page-step";
import { InfoAdminPage } from "./info-admin-page";
import { generateRandomString } from "@core/utils/utils";
import { BanReasonOptions } from "@enums/admin/ban-reason-options";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { step } from "decorators/step";

export class InfoAdminPageSteps extends BasePageStep<InfoAdminPage> {
	public constructor(gamdomPage: InfoAdminPage) {
		super(gamdomPage);
	}

	@step("Ban user")
	public async banUser(options?: { reason?: string }): Promise<void> {
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.banUserContainer,
		});
		await this.gamdomPage.map.banReasonDropdown.click();

		await this.gamdomPage.map
			.getBanReasonOption(BanReasonOptions.CUSTOM)
			.click();
		if (options?.reason) {
			await this.gamdomPage.map.banUserInput.fill(options.reason);
		}
		await this.gamdomPage.map.banUserButton.click();
		await this.gamdomPage.assertThat().isUserBanned();
		await this.gamdomPage.assertThat().isUnbanButtonDisplayed();
	}

	@step("Tip user")
	public async tipUser(tipAmount: number): Promise<void> {
		await this.gamdomPage.assertThat().isTipUserContainerDisplayed();
		await this.gamdomPage.map.tipAmountInput.clear();
		await this.gamdomPage.map.tipAmountInput.fill(tipAmount.toString());
		await this.gamdomPage.map.tipButton.click();
	}

	@step("Tip user with 2FA flow")
	public async tipUserWith2FaFlow(
		tipAmount: number,
		qrCode2FAImagePath: string,
	): Promise<void> {
		await this.tipUser(tipAmount);
		await this.gamdomPage.twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
	}

	@step("Ban user from linking 3rd party platform")
	public async banUserFromLinkingPlatform(
		platform: string,
		tableValue: string,
	): Promise<void> {
		this.gamdomPage.acceptDialog();
		await this.gamdomPage.map
			.banButtonForLinkingPlatforms(platform)
			.click();

		await this.gamdomPage.assertThat().isEnableButtonForLinkingPlatformDisplayed(
			platform
		);
		await this.gamdomPage.assertThat().isLinkingPlatformBanValueCorrect(
			tableValue, BooleanValueString.TRUE);
	}

	@step("Enable user to link 3rd party platform")
	public async enableUserToLinkPlatform(
		platform: string,
		tableValue: string,
	): Promise<void> {		
		await this.gamdomPage.map
			.enableButtonForLinkingPlatforms(platform)
			.click();

		await this.gamdomPage.assertThat().isBanButtonForLinkingPlatformDisplayed(
			platform
		);
		await this.gamdomPage.assertThat().isLinkingPlatformBanValueCorrect(
			tableValue, BooleanValueString.FALSE);
	}

	@step("Create note")
	public async createNote(count = 1): Promise<string[]> {
		const createdNotes: string[] = [];

		for (let i = 0; i < count; i++) {
			const randomNoteText = generateRandomString({ length: 10 });
			await this.gamdomPage.map.noteInput.fill(randomNoteText);
			await this.gamdomPage.map.saveNoteButton.click();
			await this.gamdomPage.assertThat().noteIsCreated(randomNoteText);
			createdNotes.push(randomNoteText);
		}

		return createdNotes;
	}

	@step("Pin note by text")
	public async pinNoteByText(noteText: string): Promise<void> {
		const noteRow = this.gamdomPage.map.noteRowByText(noteText);
		await this.gamdomPage.map.pinButtonInRow(noteRow).click();
	}

	@step("Set note inactive by text")
	public async setNoteInactiveByText(noteText: string): Promise<void> {
		const inactiveNoteRow = this.gamdomPage.map.noteRowByText(noteText);
		await this.gamdomPage.map
			.setInactiveButtonInRow(inactiveNoteRow)
			.click();
	}
}
