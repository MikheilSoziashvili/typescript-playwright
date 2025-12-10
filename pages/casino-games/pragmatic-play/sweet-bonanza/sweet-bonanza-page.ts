import { Page } from "@playwright/test";
import { BaseVisualPage } from "@pages/base-visual/base-visual-page";
import { SweetBonanzaMap } from "./sweet-bonanza-map";
import { SweetBonanzaAsserter } from "./sweet-bonanza-asserter";
import { SweetBonanzaSteps } from "./sweet-bonanza-steps";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";

export class SweetBonanzaPage extends BaseVisualPage<SweetBonanzaMap> {
	public constructor(page: Page) {
		const map = new SweetBonanzaMap();
		super(page, map);
	}

	public override assertThat(): SweetBonanzaAsserter {
		return new SweetBonanzaAsserter(this);
	}

	public override steps(): SweetBonanzaSteps {
		return new SweetBonanzaSteps(this);
	}

	@step("Click next button")
	async clickNextButton(): Promise<void> {
		logger.info("Clicking next button");
		await this.clickVisualElement(this.map.nextButton, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
		});
	}

	@step("Click spin button")
	async clickSpinButton(): Promise<void> {
		logger.info("Clicking spin button");
		await this.clickVisualElement(this.map.spinButton, {
			threshold: VisualComparisonThreshold.SUPER_RELAXED,
		});
	}
}
