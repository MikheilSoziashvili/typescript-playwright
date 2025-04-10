import { Page } from "@playwright/test";
import { SoftblockModalMap } from "./softblock-modal-map";
import { SoftblockModalAsserter } from "./softblock-modal-asserter";
import { BasePage } from "@pages/base/base-page";
import { SoftblockModalSteps } from "./softblock-modal-steps";

export class SoftblockModalPage extends BasePage<SoftblockModalMap> {
	public constructor(page: Page) {
		super(page, new SoftblockModalMap(page));
	}

	public override assertThat(): SoftblockModalAsserter {
		return new SoftblockModalAsserter(this);
	}

	public steps(): SoftblockModalSteps {
		return new SoftblockModalSteps(this);
	}
}
