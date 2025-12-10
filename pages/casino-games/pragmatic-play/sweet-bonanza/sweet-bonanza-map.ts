import { BaseVisualMap } from "@pages/base-visual/base-visual-map";
import * as path from "path";

export class SweetBonanzaMap extends BaseVisualMap {
	public constructor() {
		super(path.join(process.cwd(), "test-visual-map/sweet-bonanza"));
	}

	public get nextButton(): string {
		return this.getTemplatePath("next-button");
	}

	public get spinButton(): string {
		return this.getTemplatePath("spin-button");
	}

	public get winLabel(): string {
		return this.getTemplatePath("win-label");
	}
}
