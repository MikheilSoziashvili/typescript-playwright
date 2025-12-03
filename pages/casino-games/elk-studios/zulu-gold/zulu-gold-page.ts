import { Page } from "@playwright/test";
import { BaseVisualPage } from "@pages/base-visual/base-visual-page";
import { ZuluGoldMap } from "./zulu-gold-map";
import { ZuluGoldAsserter } from "./zulu-gold-asserter";
import { ZuluGoldSteps } from "./zulu-gold-steps";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";

export class ZuluGoldPage extends BaseVisualPage<ZuluGoldMap> {
	public constructor(page: Page) {
		const map = new ZuluGoldMap();
		super(page, map);
	}

	public override assertThat(): ZuluGoldAsserter {
		return new ZuluGoldAsserter(this);
	}

	public override steps(): ZuluGoldSteps {
		return new ZuluGoldSteps(this);
	}

	@step("Click next button")
	async clickNextButton(): Promise<void> {
		logger.info("Clicking next button");
		await this.clickVisualElement(this.map.nextButton, {
			threshold: VisualComparisonThreshold.NORMAL,
		});
	}

	@step("Click spin button")
	async clickSpinButton(): Promise<void> {
		logger.info("Clicking spin button");
		await this.clickVisualElement(this.map.spinButton, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Click spin bonus button")
	async clickSpinBonusButton(): Promise<void> {
		logger.info("Clicking spin bonus button");
		await this.clickVisualElement(this.map.spinBonusButton, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
		});
	}

	@step("Click spin bonus second button")
	async clickSpinBonusSecondButton(): Promise<void> {
		logger.info("Clicking spin bonus second button");
		await this.clickVisualElement(this.map.spinBonusSecondButton, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
		});
	}
}
