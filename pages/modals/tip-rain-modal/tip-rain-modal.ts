import { parseToFloat, waitForOpenRain } from "@core/utils/utils";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { TipRainModalAsserter } from "./tip-rain-modal-asserter";
import { TipRainModalMap } from "./tip-rain-modal-map";
import { TipRainModalSteps } from "./tip-rain-modal-steps";
import { GamdomApi } from "@api/gamdom-api";

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

	@step(`Poll for rain event to be in 'Open' status, then tip`)
	async tipRainValuePolled(
		gamdomApi: GamdomApi,
		cookie: string,
		value: number,
	): Promise<void> {
		await waitForOpenRain(gamdomApi, cookie);
		await this.tipRainValue(value);
	}
}
