import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { BanReasonOptions } from "@enums/admin/ban-reason-options";
import { BanTypeOptions } from "@enums/admin/ban-type-options";
import { BanDropdowns } from "@enums/admin/ban-dropdowns";
import { BanCategories } from "@enums/admin/ban-categories";
import { WithdrawalStatus } from "@enums/admin/withdrawal-status";

export class UserInfoInfoAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get userInfoTab(): Locator {
		return this.page.getByTestId("userInfoTabsContainer");
	}

	public get adminTitle(): Locator {
		return this.page.getByTestId("user-username");
	}

	public get banUserContainer(): Locator {
		return this.page.getByTestId("adminInfoBanContainer");
	}

	public get sendNotificationContainer(): Locator {
		return this.page.getByTestId("adminInfoSendNotificationContainer");
	}

	public banModalDropdownByLabel(label: BanDropdowns): Locator {
		return this.page.locator(
			`div:has(> label:text-is("${label}")) [data-testid="Input"] [role="combobox"]`,
		);
	}

	public getBanTypeOption(type: BanTypeOptions): Locator {
		return this.page.getByRole("option", { name: type });
	}

	public getBanCategoryOption(category: BanCategories): Locator {
		return this.page
			.locator("p", { hasText: category })
			.locator('xpath=following-sibling::span//input[@type="checkbox"]');
	}

	public getBanReasonOption(reason: BanReasonOptions): Locator {
		return this.page.locator(`[data-value="${reason}"]`);
	}

	public get banUserInput(): Locator {
		return this.page.getByLabel("Custom Reason");
	}

	public get banUserButton(): Locator {
		return this.page.getByTestId("adminInfoBanButton");
	}

	public get confirmBanButton(): Locator {
		return this.page.locator("button", { hasText: "Confirm Ban" });
	}

	public get softBanUserButton(): Locator {
		return this.banUserContainer.getByTestId("adminInfoSoftBanButton");
	}

	public bannedUserInfo(type: BanTypeOptions): Locator {
		return this.page.locator("p", { hasText: `User is ${type} banned` });
	}

	public get unbanUserButton(): Locator {
		return this.page.locator("button", { hasText: "Unban" });
	}

	public get tipButton(): Locator {
		return this.tipUserContainer.getByTestId("adminInfoTipButton");
	}

	public get sendNotificationButton(): Locator {
		return this.sendNotificationContainer.getByTestId(
			"adminInfoSendNotificationButton",
		);
	}

	public banButtonForLinkingPlatforms(platform: string): Locator {
		return this.page.locator("button", {
			hasText: `Ban this user from linking ${platform} account`,
		});
	}

	public enableButtonForLinkingPlatforms(platform: string): Locator {
		return this.page.locator("button", {
			hasText: `Enable this user to add ${platform} account`,
		});
	}

	public getPlatformRow(platform: string): Locator {
		return this.page.locator("tr", {
			has: this.page.locator("th", { hasText: platform }),
		});
	}

	public get getUserIdRow(): Locator {
		return this.page.locator("tr", {
			has: this.page.locator("th", { hasText: "id" }),
		});
	}

	public get getUserIdValueFromRow(): Locator {
		return this.getUserIdRow.locator("td");
	}

	public getBannedValueCellFromRow(row: Locator): Locator {
		return row.locator("td");
	}

	public getPlatformLinkingBannedValue(
		platform: string,
		value?: string,
	): Locator {
		const row = this.getPlatformRow(platform);
		const cell = this.getBannedValueCellFromRow(row);

		if (value === undefined) {
			return cell;
		}

		return cell.filter({ hasText: value });
	}

	public getUserIdValue(value: string): Locator {
		const cell = this.getUserIdValueFromRow;
		return cell.filter({ hasText: value });
	}

	public get adminInfoTable(): Locator {
		return this.page.getByTestId("adminInfoTable");
	}

	public get tipUserContainer(): Locator {
		return this.page.getByTestId("adminInfoTipContainer");
	}

	public get tipAmountInput(): Locator {
		return this.tipUserContainer.getByPlaceholder("Tip amount");
	}

	public get tipDropdown(): Locator {
		return this.page
			.locator('div[role="combobox"]')
			.filter({ has: this.page.locator("span.notranslate") });
	}

	public selectTipType(tip: string): Locator {
		return this.page.locator(`[data-value="${tip}"]`);
	}

	public get notesTable(): Locator {
		return this.page.getByTestId("adminNotesTable");
	}

	public noteRowAt(index: number): Locator {
		return this.notesTable.locator("tbody tr").nth(index);
	}

	public get firstNoteRow(): Locator {
		return this.noteRowAt(1); // index 0 = input row, index 1 = first note
	}

	public noteTextCellInRow(row: Locator): Locator {
		return row.locator('[data-testid^="adminNoteText-"]');
	}

	public getNoteCellByText(noteText: string): Locator {
		return this.page.locator("tbody td", { hasText: noteText });
	}

	public get noteInput(): Locator {
		return this.page.getByTestId("adminNoteInput").locator("input");
	}

	public get saveNoteButton(): Locator {
		return this.page.getByTestId("adminNoteSaveButton");
	}

	public noteRowByText(noteText: string): Locator {
		return this.page.locator("tr", { hasText: noteText });
	}

	public pinButtonInRow(row: Locator): Locator {
		return row.locator('[data-testid^="adminNotePinButton"]');
	}

	public setInactiveButtonInRow(row: Locator): Locator {
		return row.locator('[data-testid^="adminNoteSetInactiveButton"]');
	}

	private getInputByTestId(testId: string): Locator {
		return this.sendNotificationContainer
			.getByTestId(testId)
			.locator("input");
	}

	public get sendNotificationTitleInput(): Locator {
		return this.getInputByTestId("adminInfoSendNotificationTitle");
	}

	public get sendNotificationDescriptionInput(): Locator {
		return this.getInputByTestId("adminInfoSendNotificationDescription");
	}

	public get sendNotificationReasonInput(): Locator {
		return this.getInputByTestId("adminInfoSendNotificationReason");
	}

	public getTableRowByHeaderText(headerText: string): Locator {
		return this.adminInfoTable.locator("tr", {
			has: this.page.locator("th", { hasText: headerText }),
		});
	}

	public getTableCellByHeaderText(headerText: string): Locator {
		return this.getTableRowByHeaderText(headerText).locator("td");
	}

	public get lastCountryTableCell(): Locator {
		return this.getTableCellByHeaderText("last_country");
	}

	public get noteCreatedCells(): Locator {
		return this.notesTable.getByTestId(/^adminNoteCreated-/);
	}

	public unpinButtonInRow(row: Locator): Locator {
		return row.locator("button", { hasText: "Unpin" });
	}

	public userWithdrawalButton(status: WithdrawalStatus): Locator {
		return this.page
			.getByTestId("adminInfoWithdrawlContainer")
			.locator("button", {
				hasText: status,
			});
	}
}
