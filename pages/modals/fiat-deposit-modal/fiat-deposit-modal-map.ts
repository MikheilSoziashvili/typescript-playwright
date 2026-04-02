import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class FiatDepositModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get container(): Locator {
		return this.page.getByTestId(
			"transactions-details-modal-dialog-dialog",
		);
	}

	public get depositAmountInput(): Locator {
		return this.container.getByTestId("gift-Giftcard-amount-input");
	}

	public get providerInput(): Locator {
		return this.container.getByTestId("gift-Giftcard-provider-input");
	}

	public get statusText(): Locator {
		return this.container.locator("[data-testid^='transaction-status-']");
	}

	public get closeButton(): Locator {
		return this.container.getByTestId(
			"close-btn-gift-Giftcard-dialog-header-close",
		);
	}

	public get contactSupportButton(): Locator {
		return this.container.getByTestId(
			"gift-Giftcard-block-chain-transaction",
		);
	}

	public get gotItButton(): Locator {
		return this.container.getByTestId("gift-Giftcard-dialog-close");
	}
}
