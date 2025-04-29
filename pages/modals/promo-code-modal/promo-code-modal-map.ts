import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PromoCodeModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promoCodeModalContainer(): Locator {
		return this.page.getByTestId(`promo-campaign-modalContainer`);
	}

	public get promoCodeModalHeader(): Locator {
		return this.promoCodeModalContainer.getByTestId(
			`promo-campaign-modalHeader`,
		);
	}

	public get promoCodeModalBody(): Locator {
		return this.promoCodeModalContainer.getByTestId(
			`promo-campaign-modalBody`,
		);
	}

	public get promoCodeModalFooter(): Locator {
		return this.promoCodeModalContainer.getByTestId(
			`promo-campaign-modalFooter`,
		);
	}

	public get promoCodeTypeDropdown(): Locator {
		return this.promoCodeModalContainer
			.getByTestId("promo-campaign-type-dropdown")
			.getByTestId(`Input`);
	}

	public get promoCodeTypesDropdownContainer(): Locator {
		return this.page.getByTestId(`ListContainer`);
	}

	public get promoCodeCashType(): Locator {
		return this.promoCodeTypesDropdownContainer.getByTestId(
			"promo-type-option-cash",
		);
	}

	public get promoCodeFreeSpinsType(): Locator {
		return this.promoCodeTypesDropdownContainer.getByTestId(
			"promo-type-option-free_spins",
		);
	}

	public get campaignNameInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-name-input")
			.locator(`input`);
	}

	public get campaignCodeInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-code-input")
			.locator(`input`);
	}

	public get cashAmountInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-cash-amount-input")
			.locator(`input`);
	}

	public get maxRedemptionAmountInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-max-redemption-input")
			.locator(`input`);
	}

	public get expireInDaysInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-expire-days-input")
			.locator(`input`);
	}

	public get freeSpinsAmountInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("promo-campaign-spins-input")
			.locator(`input`);
	}

	public get searchGamesInput(): Locator {
		return this.promoCodeModalBody
			.getByTestId("searchInputFieldContainer")
			.locator(`input`);
	}

	public get gamesList(): Locator {
		return this.page.locator("div.MuiPopper-root ul[role=listbox]");
	}

	public get findGameToGiveFreeSpinsCardGameField(): Locator {
		return this.promoCodeModalBody
			.getByTestId("searchInputFieldContainer")
			.locator("div.MuiAutocomplete-inputRoot");
	}

	public getGameLocatorByTitle(title: string): Locator {
		return this.gamesList.locator(
			`ul li div[class*="OptionTitle"]:text-is("${title}")`,
		);
	}

	public get createPromoCodeButton(): Locator {
		return this.promoCodeModalFooter.getByTestId(
			`promo-campaign-save-button`,
		);
	}

	public get closePromoCodeModalButton(): Locator {
		return this.promoCodeModalHeader.getByTestId(`closeButton`);
	}
}
