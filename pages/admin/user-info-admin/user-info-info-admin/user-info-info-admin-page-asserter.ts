import { expect, Locator } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { UserInfoInfoAdminPage } from "./user-info-info-admin-page";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { CountryCodes } from "@enums/country-codes";
import { quotesRemovalPattern } from "@support/regex-patterns";
import { BanTypeOptions } from "@enums/admin/ban-type-options";
import { BanCategories } from "@enums/admin/ban-categories";

export class UserInfoInfoAdminPageAsserter extends BaseAsserter<UserInfoInfoAdminPage> {
	public constructor(page: UserInfoInfoAdminPage) {
		super(page);
	}

	@step("Check if page elements are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.adminInfoTable,
				this.gamdomPage.map.userInfoTab,
				this.gamdomPage.map.tipButton,
				this.gamdomPage.map.sendNotificationButton,
			],
			Timeout.MAX,
		);
	}

	@step("Check username is displayed in title")
	public async isUsernameDisplayedInTitle(username: string): Promise<void> {
		await expect(this.gamdomPage.map.adminTitle).toHaveText(username);
	}

	@step("Check user is banned")
	public async isUserBanned(type: BanTypeOptions): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bannedUserInfo(type),
		]);
	}

	@step("Check unban button is displayed")
	public async isUnbanButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.unbanUserButton,
		]);
	}

	@step("Check category ban options are displayed")
	public async categoryBanOptionsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.getBanCategoryOption(BanCategories.CASINO),
			this.gamdomPage.map.getBanCategoryOption(BanCategories.SPORTSBOOK),
		]);
	}

	@step("Confirm ban button is disabled")
	public async isConfirmBanButtonDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.confirmBanButton,
		]);
	}

	@step("Confirm ban button is enabled")
	public async isConfirmBanButtonEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.confirmBanButton,
		]);
	}

	@step("Check if ban user from linking platform button is displayed")
	public async isBanButtonForLinkingPlatformDisplayed(
		platform: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.banButtonForLinkingPlatforms(platform),
		]);
	}

	@step("Check if Enable user to link platform button is displayed")
	public async isEnableButtonForLinkingPlatformDisplayed(
		platform: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.enableButtonForLinkingPlatforms(platform),
		]);
	}

	@step("Check if the table value for linking platform ban is correct")
	public async isLinkingPlatformBanValueCorrect(
		platform: string,
		expectedValue: string,
	): Promise<void> {
		const actualValue = await this.gamdomPage.map
			.getPlatformLinkingBannedValue(platform)
			.textContent();
		if (!actualValue?.trim) {
			throw new Error(
				`Platform linking ban value for ${platform} is not found.`,
			);
		}
		await this.checkStringElementsAreEqual(
			[expectedValue],
			[actualValue.trim()],
		);
	}

	@step("The userId is present in the table")
	public async userIdIsPresentInTable(expectedValue: string): Promise<void> {
		const actualValue = await this.gamdomPage.map
			.getUserIdValue(expectedValue)
			.textContent();
		const actualValueTrimmed = actualValue?.trim();

		if (!actualValueTrimmed) {
			throw new Error(`User ID value for ${expectedValue} is not found.`);
		}

		await this.checkStringElementsAreEqual(
			[expectedValue],
			[actualValueTrimmed],
		);
	}

	@step("Check tip user container is displayed")
	public async isTipUserContainerDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.tipUserContainer,
		]);
	}

	@step("Check note is created")
	public async noteIsCreated(noteText: string): Promise<void> {
		await expect(
			this.gamdomPage.map.getNoteCellByText(noteText),
		).toHaveCount(1);
	}

	@step("Check if note is pinned")
	public async noteIsPinned(noteText: string): Promise<void> {
		const firstRow = this.gamdomPage.map.firstNoteRow;
		await this.expectNoteTextInRow(firstRow, noteText);
		await expect(
			this.gamdomPage.map
				.noteTextCellInRow(firstRow)
				.locator(Attributes.SPAN),
		).toContainText("Pinned:");
	}

	@step("Check if note is inactive")
	public async noteIsInactive(noteText: string): Promise<void> {
		const noteRow = this.gamdomPage.map.noteRowByText(noteText);
		await this.expectNoteTextInRow(noteRow, noteText);

		await expect(this.gamdomPage.map.noteTextCellInRow(noteRow)).toHaveCSS(
			"text-decoration",
			/line-through/,
		);

		const pinButton = this.gamdomPage.map.pinButtonInRow(noteRow);
		const inactiveButton =
			this.gamdomPage.map.setInactiveButtonInRow(noteRow);
		await this.checkElementsAreHidden([pinButton, inactiveButton]);
	}

	@step("Expect note text in row")
	private async expectNoteTextInRow(
		row: Locator,
		expectedText: string,
	): Promise<void> {
		const cell = this.gamdomPage.map.noteTextCellInRow(row);
		await expect(cell).toContainText(expectedText);
	}

	@step("Notification sent successfully toast is displayed")
	public async notificationSentToastIsDisplayed(): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(ToastSubTitle.NOTIFICATION_SENT);
	}

	@step("Check last country code is correct")
	public async lastCountryCodeCorrect(
		countryCode: CountryCodes,
	): Promise<void> {
		const cellText =
			await this.gamdomPage.map.lastCountryTableCell.textContent();
		const cleanedText = cellText?.replace(quotesRemovalPattern, "") || "";

		await this.checkStringElementsAreEqual([countryCode], [cleanedText]);
	}
}
