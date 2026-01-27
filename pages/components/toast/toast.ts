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

	@step("Click close button in toast")
	public async clickCloseButton(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await this.map.toastCloseButtonLocator(options).click();
	}

	@step("Get toast message")
	public async getToastMessage(): Promise<string> {
		const container = this.map.toastContainer();

		await container.waitFor();

		const subTitle = this.map.toastSubTitleLocator();
		await subTitle.waitFor();

		return (await subTitle.innerText()).trim();
	}
}
