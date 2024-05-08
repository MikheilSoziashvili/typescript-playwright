import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { CommonUserOptionsPopupMap } from "./common-user-options-popup-map";
import { CommonUserOptionsPopupAsserter } from "./common-user-options-popup-asserter";
import { CommonUserPopupOptions } from "@enums/common-user-popup-options";
import { Timeout } from "@enums/timeout";
import { Delay } from "@enums/delay";
import { VisibilityStates } from "@enums/playwright/visibility-states";

export class CommonUserOptionsPopup extends BaseComponent<CommonUserOptionsPopupMap> {
	constructor(page: Page) {
		super(page, new CommonUserOptionsPopupMap(page));
	}

	public assertThat(): CommonUserOptionsPopupAsserter {
		return new CommonUserOptionsPopupAsserter(this);
	}

	public async clickOption(option: CommonUserPopupOptions): Promise<void> {
		await this.map.popupLocator.waitFor({
			state: VisibilityStates.VISIBLE,
		});
		await this.map
			.popupOption(option)
			.click({ timeout: Timeout.EXTRA_SHORT, delay: Delay.EXTRA_SHORT });
	}
}
