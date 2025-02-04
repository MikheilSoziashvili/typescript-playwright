import { parseToFloat } from "@core/utils/utils";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { TipRainModalAsserter } from "./tip-rain-modal-asserter";
import { TipRainModalMap } from "./tip-rain-modal-map";
import { TipRainModalSteps } from "./tip-rain-modal-steps";

export class TipRainModal extends BasePage<TipRainModalMap> {
	constructor(page: Page) {
		super(page, new TipRainModalMap(page));
	}

	public assertThat(): TipRainModalAsserter {
		return new TipRainModalAsserter(this);
	}

	public steps(): TipRainModalSteps {
		return new TipRainModalSteps(this);
	}

	@step()
	public async insertTipRainValue(value: number): Promise<void> {
		await this.map.amountInput.fill(parseToFloat(value));
	}

	@step()
	async tipRainValue(value: number): Promise<void> {
		await this.insertTipRainValue(value);
		await this.map.tipButton.click();
	}
}
