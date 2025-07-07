import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { BanReasonOptions } from "@enums/admin/ban-reason-options";

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

	public get banReasonDropdown(): Locator {
		return this.banUserContainer.getByTestId("Input");
	}

	public getBanReasonOption(reason: BanReasonOptions): Locator {
		return this.page.locator(`[data-value="${reason}"]`);
	}

	public get banUserInput(): Locator {
		return this.banUserContainer.getByTestId("adminInfoBanReasonInput");
	}

	public get banUserButton(): Locator {
		return this.banUserContainer.getByTestId("adminInfoBanButton");
	}

	public get softBanUserButton(): Locator {
		return this.banUserContainer.getByTestId("adminInfoSoftBanButton");
	}

	public get bannedUserInfo(): Locator {
		return this.page.getByTestId("adminInfoBanReason");
	}

	public get unbanUserButton(): Locator {
		return this.bannedUserInfo.getByTestId("adminInfoUnbanButton");
	}

	public get tipButton(): Locator {
		return this.tipUserContainer.getByTestId("adminInfoTipButton");
	}

	public get sendNotificationButton(): Locator {
		return this.page.getByTestId("adminInfoSendNotificationButton");
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

	public get adminInfoTable(): Locator {
		return this.page.getByTestId("adminInfoTable");
	}

	public get tipUserContainer(): Locator {
		return this.page.getByTestId("adminInfoTipContainer");
	}

	public get tipAmountInput(): Locator {
		return this.tipUserContainer.getByPlaceholder("Tip amount");
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
}
