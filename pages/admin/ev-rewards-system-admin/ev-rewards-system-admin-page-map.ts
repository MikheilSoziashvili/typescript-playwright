import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class EvRewardsSystemAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get adminSection(): Locator {
		return this.page.getByTestId("admin-section");
	}

	public get bulkRewardsUploadButton(): Locator {
		return this.page.locator('span:text-is("Bulk Rewards Upload")');
	}

	public get rewardTypeLabel(): Locator {
		return this.page
			.getByTestId("Label")
			.filter({ hasText: "Reward Type" });
	}

	public get rewardTypeDropdownContainer(): Locator {
		return this.adminSection.locator(
			'div:has(> label:has-text("Reward Type"))',
		);
	}

	public get rewardTypeDropdownLabel(): Locator {
		return this.rewardTypeDropdownContainer.getByTestId("Input");
	}

	public get evRewardOption(): Locator {
		return this.rewardTypeDropdownLabel.filter({
			has: this.page.locator(`[role="combobox"]`),
		});
	}

	public pickRewardTypeFromDropdown(optionValue: string): Locator {
		return this.page
			.getByTestId("ListContainer")
			.locator(`li[data-value="${optionValue}"]`);
	}

	public get periodDropdown(): Locator {
		return this.page.getByLabel(`Period Type`);
	}

	public periodTypeOption(periodType: string): Locator {
		return this.periodDropdown.getByText(periodType);
	}

	public get periodIdentifierDropdown(): Locator {
		return this.page.getByLabel(`Period Identifier`);
	}

	public get getPeriodIdentifierOption(): Locator {
		return this.page.getByTestId("ListContainer").locator(`ul > li`);
	}

	public get emptyRewardTypeDetailsText(): Locator {
		return this.adminSection.getByText(
			"Please enter details to following inputs: Reward Type",
		);
	}

	public get freeSpinsPromotionTypeDetailsText(): Locator {
		return this.adminSection.getByText(
			"Please enter details to following inputs: Reward Becomes Available After Date, Reward Expires After Date",
		);
	}

	public get rewardAvailableAfterDateInput(): Locator {
		return this.adminSection.locator(
			`xpath=.//input[@id=//label[contains(normalize-space(.), "Reward Becomes Available After Date")]/@for]`,
		);
	}

	public get rewardExpiresAfterDateInput(): Locator {
		return this.adminSection.locator(
			`xpath=.//input[@id=//label[contains(normalize-space(.), "Reward Expires After Date")]/@for]`,
		);
	}

	public get visibleDatePicker(): Locator {
		return this.page.locator(".rdtPicker:visible");
	}

	public get todayCell(): Locator {
		return this.visibleDatePicker.locator("td.rdtToday");
	}

	public dayCellByValue(day: number): Locator {
		return this.visibleDatePicker.locator(`td.rdtDay[data-value="${day}"]`);
	}

	public get datePickerNext(): Locator {
		return this.visibleDatePicker.locator('th[class*="rdtNext"]');
	}

	public get datePickerPrevious(): Locator {
		return this.visibleDatePicker.locator('th[class*="rdtPrev"]');
	}

	public get inputBulkRewardFile(): Locator {
		return this.page.locator('input[type="file"][accept=".csv"]');
	}

	public get rewardUsersButton(): Locator {
		return this.page.getByRole("button", { name: "Reward Users" });
	}

	public get successLogsHeader(): Locator {
		return this.adminSection.getByText("Success Logs");
	}

	public get successLogsTextarea(): Locator {
		return this.textareaAfter(this.successLogsHeader);
	}

	public get errorLogsHeader(): Locator {
		return this.adminSection.getByText("Error Logs");
	}

	public get errorLogsTextarea(): Locator {
		return this.textareaAfter(this.errorLogsHeader);
	}

	private textareaAfter(header: Locator): Locator {
		return header.locator("xpath=following::textarea[1]");
	}
}
