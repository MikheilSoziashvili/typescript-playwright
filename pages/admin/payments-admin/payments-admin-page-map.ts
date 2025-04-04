import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PaymentsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get paymentAdminPageContent(): Locator {
		return this.page.getByTestId("adminPaymentsPageContent");
	}

	public get buttonsContainer(): Locator {
		return this.paymentAdminPageContent.getByTestId("buttonContainer");
	}

	public get settingsButton(): Locator {
		return this.buttonsContainer.getByTestId("settingsButton");
	}
}
