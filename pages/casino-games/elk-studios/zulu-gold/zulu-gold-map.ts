import { BaseVisualMap } from "@pages/base-visual/base-visual-map";
import * as path from "path";

export class ZuluGoldMap extends BaseVisualMap {
	public constructor() {
		super(path.join(process.cwd(), "test-visual-map/zulu-gold"));
	}

	public get nextButton(): string {
		return this.getTemplatePath("next-button");
	}

	public get spinButton(): string {
		return this.getTemplatePath("spin-button");
	}

	public get spinBonusButton(): string {
		return this.getTemplatePath("spin-bonus-button");
	}

	public get spinBonusSecondButton(): string {
		return this.getTemplatePath("spin-bonus-button-second");
	}

	public get winLabel(): string {
		return this.getTemplatePath("win-label");
	}
}
