import { Page } from "@playwright/test";
import { BaseVisualPage } from "@pages/base-visual/base-visual-page";
import { SweetBonanzaCandyLandMap } from "./sweet-bonanza-candy-land-map";
import { SweetBonanzaCandyLandAsserter } from "./sweet-bonanza-candy-land-asserter";
import { SweetBonanzaCandyLandSteps } from "./sweet-bonanza-candy-land-steps";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";

export class SweetBonanzaCandyLandPage extends BaseVisualPage<SweetBonanzaCandyLandMap> {
	public constructor(page: Page) {
		const map = new SweetBonanzaCandyLandMap();
		super(page, map);
	}

	public override assertThat(): SweetBonanzaCandyLandAsserter {
		return new SweetBonanzaCandyLandAsserter(this);
	}

	public override steps(): SweetBonanzaCandyLandSteps {
		return new SweetBonanzaCandyLandSteps(this);
	}

	@step("Click bet all number button")
	async clickBetAllNumberButton(): Promise<void> {
		logger.info("Clicking bet all number button");
		await this.clickVisualElement(this.map.betAllNumberButton, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Click bet one number button")
	async clickBetOneNumberButton(): Promise<void> {
		logger.info("Clicking bet one number button");
		await this.clickVisualElement(this.map.betOneNumberButton, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}
}

