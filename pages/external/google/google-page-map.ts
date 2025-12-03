import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class GooglePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gEmailField(): Locator {
		return this.page.locator("#identifierId");
	}

	public get gMoveForwardBtn(): Locator {
		return this.page.locator("[id='identifierNext']");
	}

	public get gPasswordField(): Locator {
		return this.page.locator("input[name='Passwd']");
	}

	public get gTwoFactorCodeField(): Locator {
		return this.page.locator("input[type='tel']");
	}

	public get gPasswordNextBtn(): Locator {
		return this.page.locator("[id='passwordNext']");
	}

	public get gTwoFactoryNextBtn(): Locator {
		return this.page.locator("[id='totpNext']");
	}

	public get wrongCodeMessage(): Locator {
		return this.page.getByText(/Wrong code/);
	}

	public get verifyItsYouScreen(): Locator {
		return this.page.getByText("Verify it’s you");
	}

	public get gTryAnotherWayBtn(): Locator {
		return this.page.getByRole("button", {
			name: /try another way/i,
		});
	}

	public get gGetVerificationCodeBtn(): Locator {
		return this.page.getByRole("button", {
			name: /get a verification code/i,
		});
	}
}
