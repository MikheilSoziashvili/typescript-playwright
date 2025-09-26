import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoInfoAdminPage } from "./user-info-info-admin-page";
import { generateRandomString } from "@core/utils/utils";
import { BanReasonOptions } from "@enums/admin/ban-reason-options";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { step } from "decorators/step";
import { BanTypeOptions } from "@enums/admin/ban-type-options";
import { BanDropdowns } from "@enums/admin/ban-dropdowns";
import { BanCategories } from "@enums/admin/ban-categories";
import { Delay } from "@enums/delay";

export class UserInfoInfoAdminPageSteps extends BasePageStep<UserInfoInfoAdminPage> {
	public constructor(gamdomPage: UserInfoInfoAdminPage) {
		super(gamdomPage);
	}

	@step("Ban user")
	public async banUser(options?: { reason?: string }): Promise<void> {
		await this.gamdomPage.clickBanUserButton();

		await this.gamdomPage.map
			.banModalDropdownByLabel(BanDropdowns.BAN_TYPE)
			.click();
		await this.gamdomPage.map.getBanTypeOption(BanTypeOptions.HARD).click();

		await this.gamdomPage.map
			.banModalDropdownByLabel(BanDropdowns.BAN_REASON)
			.click({ delay: Delay.MAX_SHORT });
		await this.gamdomPage.map
			.getBanReasonOption(BanReasonOptions.CUSTOM)
			.click({ delay: Delay.MAX_SHORT });
		if (options?.reason) {
			await this.gamdomPage.map.banUserInput.fill(options.reason);
		}
		await this.gamdomPage.map.confirmBanButton.click();
		await this.gamdomPage.assertThat().isUserBanned(BanTypeOptions.HARD);
		await this.gamdomPage.assertThat().isUnbanButtonDisplayed();
	}

	@step("Ban user - verify category options")
	public async verifyBanUserCategoryOptions(): Promise<void> {
		await this.gamdomPage.clickBanUserButton();

		await this.gamdomPage.map
			.banModalDropdownByLabel(BanDropdowns.BAN_TYPE)
			.click();
		await this.gamdomPage.map
			.getBanTypeOption(BanTypeOptions.CATEGORY)
			.click();

		await this.gamdomPage.assertThat().categoryBanOptionsDisplayed();
		await this.gamdomPage.assertThat().isConfirmBanButtonEnabled();

		await this.gamdomPage.toggleBanCategoryOptions(BanCategories.CASINO);
		await this.gamdomPage.toggleBanCategoryOptions(
			BanCategories.SPORTSBOOK,
		);
		await this.gamdomPage.assertThat().isConfirmBanButtonDisabled();
	}

	@step("Tip user")
	public async tipUser(tipAmount: number, tipType?: string): Promise<void> {
		await this.gamdomPage.assertThat().isTipUserContainerDisplayed();
		await this.gamdomPage.map.tipAmountInput.clear();
		await this.gamdomPage.map.tipAmountInput.fill(tipAmount.toString());
		if (tipType) {
			await this.gamdomPage.map.tipDropdown.click();
			await this.gamdomPage.map.selectTipType(tipType).click();
		}
		await this.gamdomPage.map.tipButton.click();
	}

	@step("Tip user with 2FA flow")
	public async tipUserWith2FaFlow(
		tipAmount: number,
		qrCode2FAImagePath: string,
		tipType?: string,
	): Promise<void> {
		await this.tipUser(tipAmount, tipType);
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

		await this.gamdomPage
			.assertThat()
			.isEnableButtonForLinkingPlatformDisplayed(platform);
		await this.gamdomPage
			.assertThat()
			.isLinkingPlatformBanValueCorrect(
				tableValue,
				BooleanValueString.TRUE,
			);
	}

	@step("Enable user to link 3rd party platform")
	public async enableUserToLinkPlatform(
		platform: string,
		tableValue: string,
	): Promise<void> {
		this.gamdomPage.acceptDialog();
		await this.gamdomPage.map
			.enableButtonForLinkingPlatforms(platform)
			.click();

		await this.gamdomPage
			.assertThat()
			.isBanButtonForLinkingPlatformDisplayed(platform);
		await this.gamdomPage
			.assertThat()
			.isLinkingPlatformBanValueCorrect(
				tableValue,
				BooleanValueString.FALSE,
			);
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

	@step("Send notification and assert toast is displayed")
	public async sendNotification(
		title: string,
		description?: string,
		reason?: string,
	): Promise<void> {
		await this.gamdomPage.fillNotificationTitle(title);
		await this.gamdomPage.fillNotificationDescription(description ?? "");
		await this.gamdomPage.fillNotificationReason(reason ?? "");
		await this.gamdomPage.clickSendNotificationButton();
		await this.gamdomPage.assertThat().notificationSentToastIsDisplayed();
	}
}
