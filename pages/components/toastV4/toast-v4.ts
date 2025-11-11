import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { ToastV4Map as ToastV4Map } from "./toast-v4-map";
import { step } from "decorators/step";
import { ToastV4Asserter } from "./toast-v4-asserter";

export class ToastV4 extends BaseComponent<ToastV4Map> {
	constructor(page: Page) {
		super(page, new ToastV4Map(page));
	}

	public assertThat(): ToastV4Asserter {
		return new ToastV4Asserter(this);
	}

	@step("Click close button in toast V4 - v4")
	public async clickCloseButtonV4(options?: {
		index?: number;
		subTitle?: string;
	}): Promise<void> {
		await this.map.toastCloseButtonLocatorV4(options).click();
	}
}
