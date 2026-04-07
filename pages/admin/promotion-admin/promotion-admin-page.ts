import { BasePage } from "@pages/base/base-page";
import { expect } from "@playwright/test";
import { Page } from "playwright";

import { BasePageNavigationParametersType } from "@core/types/types";
import { PROMOTION_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { PromotionAdminMap } from "./promotion-admin-page-map";
import { PromotionAdminAsserter } from "./promotion-admin-page-asserter";
import { PromotionAdminSteps } from "./promotion-admin-page-steps";
import { step } from "decorators/step";
import { VisibilityOptions } from "@enums/visibility-options";

export class PromotionAdminPage extends BasePage<PromotionAdminMap> {
	public constructor(page: Page) {
		super(page, new PromotionAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PROMOTION_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PromotionAdminAsserter {
		return new PromotionAdminAsserter(this);
	}

	public steps(): PromotionAdminSteps {
		return new PromotionAdminSteps(this);
	}

	@step("Click create promotion button")
	public async clickCreateNewPromotionButton(): Promise<void> {
		await this.map.createNewPromotionButton.click();
	}

	@step("Click delete promotion button")
	public async clickDeletePromotionButton(
		promotionTitle: string,
	): Promise<void> {
		await this.map
			.promotionStatusTableDeleteButtonByPromotionTitle(promotionTitle)
			.click();
	}

	@step("Click duplicate promotion button")
	public async clickDuplicatePromotionButton(
		promotionTitle: string,
	): Promise<void> {
		await this.map
			.promotionStatusTableDuplicateButtonByPromotionTitle(promotionTitle)
			.click();
	}

	@step("Click edit promotion button")
	public async clickEditPromotionButton(
		promotionTitle: string,
	): Promise<void> {
		await this.map
			.promotionStatusTableEditButtonByPromotionTitle(promotionTitle)
			.click();
	}

	@step("Choose table rows to be maximum pagination")
	public async choosePromotionsTableRowsMaxPagination(): Promise<void> {
		await this.map.promotionsTableRowsPaginationDropdown.click();
		await this.map.promotionsTableRowsPaginationDropdownMaxOption.click();
	}

	@step("Set promotion visibility to {visibility} in the promotions table")
	public async setPromotionVisibility(
		promotionName: string,
		visibility: VisibilityOptions,
	): Promise<void> {
		const container =
			this.map.promotionVisibilityCheckboxContainerByPromotionTitle(promotionName);
		const checkbox =
			this.map.promotionVisibilityCheckboxByPromotionTitle(promotionName);
		const shouldBeChecked = visibility === VisibilityOptions.VISIBLE;
		const isChecked = await checkbox.isChecked();
		if (isChecked !== shouldBeChecked) {
			await container.click();
			await expect.poll(async () => checkbox.isChecked()).toBe(shouldBeChecked);
		}
	}
}
