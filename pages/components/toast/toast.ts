import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { ToastMap as ToastMap } from "./toast-map";
import { ToastAsserter as ToastAsserter } from "./toast-asserter";
import { step } from "decorators/step";

export class Toast extends BaseComponent<ToastMap> {
	constructor(page: Page) {
		super(page, new ToastMap(page));
	}

	public assertThat(): ToastAsserter {
		return new ToastAsserter(this);
	}

	@step("Click here button")
	public async clickHereButton(options?: {
		index?: number;
		subTitle: string;
	}): Promise<void> {
		await this.map.toastHereButtonLocator(options).click();
	}
}
