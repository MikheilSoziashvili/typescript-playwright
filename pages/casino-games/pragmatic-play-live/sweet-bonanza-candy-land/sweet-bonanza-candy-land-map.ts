import { BaseVisualMap } from "@pages/base-visual/base-visual-map";
import * as path from "path";

export class SweetBonanzaCandyLandMap extends BaseVisualMap {
	public constructor() {
		super(path.join(process.cwd(), "test-visual-map/sweet-bonanza-candy-land"));
	}

	public get betsBlock(): string {
		return this.getTemplatePath("bets-block");
	}

	public get waitingForNextGameBlock(): string {
		return this.getTemplatePath("waiting-for-next-game-block");
	}

	public get betAllNumberButton(): string {
		return this.getTemplatePath("bet-all-number-button");
	}

	public get betOneNumberButton(): string {
		return this.getTemplatePath("bet-one-number-button");
	}

	public get winLabel(): string {
		return this.getTemplatePath("win-label");
	}
}

