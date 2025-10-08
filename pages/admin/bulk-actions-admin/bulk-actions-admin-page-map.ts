import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class BulkActionsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get bulkActionSection(): Locator {
		return this.page.getByTestId("bulk-actions-section");
	}

	public get notificationsTab(): Locator {
		return this.page.getByTestId("bulk-actions-nav-link-Notification");
	}

	public get userIdsTextarea(): Locator {
		return this.page.getByPlaceholder(
			"Enter user IDs separated by new lines",
		);
	}

	public get notificationTitleInput(): Locator {
		return this.page
			.locator("h4", { hasText: "Notification Title" })
			.locator("+ div input[type='text']");
	}

	public get notificationDescriptionInput(): Locator {
		return this.page.getByPlaceholder("Enter notification description");
	}

	public get processNotificationsButton(): Locator {
		return this.page.locator("button", {
			hasText: "Process Notifications",
		});
	}

	public get successLogs(): Locator {
		return this.page
			.locator("h3", { hasText: "Success Logs" })
			.locator("+ div textarea[rows='4']");
	}

	public get errorLogs(): Locator {
		return this.page
			.locator("h3", { hasText: "Error Logs" })
			.locator("+ div textarea[rows='4']");
	}

	public get tipTab(): Locator {
		return this.page.getByTestId("bulk-actions-nav-link-Tip");
	}

	public get inputBulkTipFile(): Locator {
		return this.page.locator('input[type="file"][accept=".csv"]');
	}

	public get tipReasonDropdown(): Locator {
		return this.bulkActionSection.locator(
			`[role="combobox"][aria-haspopup="listbox"]`,
		);
	}

	public tipReasonOption(optionLabel: string): Locator {
		return this.page.getByTestId(`adminInfoTipReasonItem-${optionLabel}`);
	}

	public get processTipsButton(): Locator {
		return this.page.locator("button", {
			hasText: "Process Tips",
		});
	}

	public get summarySection(): Locator {
		return this.page.locator("h3", { hasText: "Summary" });
	}

	public get summaryTotalUsd(): Locator {
		return this.summarySection.locator(
			'xpath=following::p[contains(., "Total USD")]',
		);
	}

	public get summaryTotalUsers(): Locator {
		return this.summarySection.locator(
			'xpath=following::p[contains(., "Total Users")]',
		);
	}
}
