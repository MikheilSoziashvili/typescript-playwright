import { BaseComponent } from "@base/base-component";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { WagerRequirementPopupAsserter } from "./wager-requirement-popup-asserter";
import { WagerRequirementPopupMap } from "./wager-requirement-popup-map";
import { WagerRequirementPopupSteps } from "./wager-requirement-popup-steps";

export class WagerRequirementPopup extends BaseComponent<WagerRequirementPopupMap> {
	public constructor(page: Page) {
		super(page, new WagerRequirementPopupMap(page));
	}

	public assertThat(): WagerRequirementPopupAsserter {
		return new WagerRequirementPopupAsserter(this);
	}

	public steps(): WagerRequirementPopupSteps {
		return new WagerRequirementPopupSteps(this);
	}

	@step("Click toggle button")
	public async clickToggleButton(): Promise<void> {
		await this.map.toggleButton.click();
	}

	@step("Drag popup")
	public async dragPopup(
		targetX: number,
		targetY: number,
	): Promise<void> {
		await this.map.dragIcon.hover();
		await this.page.mouse.down();
		await this.page.mouse.move(targetX, targetY, { steps: 10 });
		await this.page.mouse.up();
	}

	@step("Get wagered amount text")
	public async getWageredAmountText(): Promise<string> {
		return this.map.wageredAmount.innerText();
	}

	@step("Get target amount text")
	public async getTargetAmountText(): Promise<string> {
		return this.map.targetAmount.innerText();
	}
}
