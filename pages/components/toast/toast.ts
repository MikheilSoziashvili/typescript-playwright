import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { ToastMap as ToastMap } from "./toast-map";
import { ToastAsserter as ToastAsserter } from "./toast-asserter";

export class Toast extends BaseComponent<ToastMap> {
	constructor(page: Page) {
		super(page, new ToastMap(page));
	}

	public assertThat(): ToastAsserter {
		return new ToastAsserter(this);
	}

	public async clickHereButton(options?: {
		index?: number;
		subTitle: string;
	}): Promise<void> {
		await this.map.toastHereButtonLocator(options).click();
	}
}
