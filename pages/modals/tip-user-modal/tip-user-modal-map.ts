import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipUserModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.locator(
			'div[class*=MuiPaper-elevation]:has(div > div:text-is("Tip User"))',
		);
	}

	public get modalBody(): Locator {
		return this.modalLocator.locator("div[role=dialog]");
	}

	public get modalContent(): Locator {
		return this.modalBody.locator("div[class*=_ContentWrapper]");
	}

	public get titleContainer(): Locator {
		return this.modalContent.locator("div[class*=TitleContainer]");
	}

	public get inputContainer(): Locator {
		return this.modalContent.locator("div[class*=InputContainer]");
	}

	public get tipAmountField(): Locator {
		return this.inputContainer.locator("input");
	}

	public get clearAmountButton(): Locator {
		return this.inputContainer.locator('button:text-is("Clear")');
	}

	public get warningContainer(): Locator {
		return this.modalContent.locator("div[class*=WarningContainer]");
	}

	public get tipButton(): Locator {
		return this.modalBody.locator(
			'div[class*=_ButtonsWrapper] button:has(span:text-is("Tip"))',
		);
	}
}
