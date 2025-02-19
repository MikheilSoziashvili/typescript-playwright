import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PlinkoGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get signInButton(): Locator {
		return this.page.locator("button[class*='Formstyled__SubmitButton']");
	}

	public get signInModal(): Locator {
		return this.page.locator("div[class*='Modal-styled__ModalBody']");
	}

	public get usernameField(): Locator {
		return this.getInputField("username", this.signInModal);
	}

	public get passwordField(): Locator {
		return this.getInputField("password", this.signInModal);
	}

	public get partnersSlider(): Locator {
		return this.signInModal.locator(
			"div[class*='AuthPopup-styled__SliderContainer-sc-']",
		);
	}

	public get startPlayingButton(): Locator {
		return this.page.getByTestId("start-playing-login");
	}
}
