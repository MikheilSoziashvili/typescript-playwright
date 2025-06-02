import { expect, Locator } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { InfoAdminPage } from "./info-admin-page";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";

export class InfoAdminPageAsserter extends BaseAsserter<InfoAdminPage> {
	public constructor(page: InfoAdminPage) {
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
	public async isUserBanned(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bannedUserInfo,
		]);
	}

	@step("Check unban button is displayed")
	public async isUnbanButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.unbanUserButton,
		]);
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

		expect(
			await this.getTextDecoration(
				this.gamdomPage.map.noteTextCellInRow(noteRow),
			),
		).toContain("line-through");

		const pinButton = this.gamdomPage.map.pinButtonInRow(noteRow);
		const inactiveButton =
			this.gamdomPage.map.setInactiveButtonInRow(noteRow);
		await this.checkElementsAreHidden([pinButton, inactiveButton]);
	}

	private async expectNoteTextInRow(
		row: Locator,
		expectedText: string,
	): Promise<void> {
		const cell = this.gamdomPage.map.noteTextCellInRow(row);
		await expect(cell).toContainText(expectedText);
	}
}
