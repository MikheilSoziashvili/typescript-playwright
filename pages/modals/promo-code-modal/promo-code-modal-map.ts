import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PromoCodeModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promoCodeModalContainer(): Locator {
		return this.page.locator(
			`//div[text()='New Promo Code']//ancestor::div[contains(@class,'MuiPaper-elevation')]`,
		);
	}

	public get promoCodeModalHeader(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='ModalHead-sc-']`);
	}

	public get promoCodeModalBody(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='ModalBody-sc-']`);
	}

	public get promoCodeModalFooter(): Locator {
		return this.promoCodeModalContainer.locator(`[class*='Footer-sc']`);
	}

	public get promoCodeTypeDropdown(): Locator {
		return this.promoCodeModalContainer.locator(`[role="combobox"]`, {
			hasText: "Type:",
		});
	}

	public get promoCodeTypesDropdownContainer(): Locator {
		return this.page.getByTestId(`ListContainer`);
	}

	public get promoCodeCashType(): Locator {
		return this.getDropdownOptionSelector(
			"cash",
			this.promoCodeTypesDropdownContainer,
		);
	}

	public get promoCodeFreeSpinsType(): Locator {
		return this.getDropdownOptionSelector(
			"free_spins",
			this.promoCodeTypesDropdownContainer,
		);
	}

	public promoCodeInputFieldByPlaceholder(placeholder: string): Locator {
		return this.promoCodeModalBody.locator(
			`//label[text()='${placeholder}']//following-sibling::div//input`,
		);
	}

	public get campaignNameInput(): Locator {
		return this.promoCodeInputFieldByPlaceholder("Campaign name");
	}

	public get campaignCodeInput(): Locator {
		return this.promoCodeInputFieldByPlaceholder("Campaign code");
	}

	public get cashAmountInput(): Locator {
		return this.promoCodeInputFieldByPlaceholder("Cash amount in USD");
	}

	public get maxRedemptionAmountInput(): Locator {
		return this.promoCodeInputFieldByPlaceholder("Max. Redemption");
	}

	public get expireInDaysInput(): Locator {
		return this.promoCodeInputFieldByPlaceholder("Expire in days");
	}

	public get createPromoCodeButton(): Locator {
		return this.promoCodeModalFooter.locator(`button`, {
			hasText: "Create Promo Code",
		});
	}

	public get closePromoCodeModalButton(): Locator {
		return this.promoCodeModalContainer.locator(`button`, {
			has: this.page.locator(`i[class*="icon-remove"]`),
		});
	}
}
