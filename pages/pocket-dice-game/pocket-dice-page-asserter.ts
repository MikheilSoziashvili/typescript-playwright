import { BaseAsserter } from "@pages/base/base-asserter";
import { PocketDicePage } from "./pocket-dice-page";
import { step } from "decorators/step";

export class PocketDiceAsserter extends BaseAsserter<PocketDicePage> {
	public constructor(page: PocketDicePage) {
		super(page);
	}

	@step("Check if Roll dice button is visible")
	public async rollDiceButtonVisible(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.rollButton]);
	}

	@step("Check if Start Playing button is enabled")
	public async startPlayingButtonEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.startAutobetButton,
		]);
	}

	@step("Check if win is detected")
	public async isWinDetected(): Promise<boolean> {
		try {
			await this.checkElementsAreVisible([this.gamdomPage.map.winBanner]);
			return true;
		} catch {
			return false;
		}
	}
}
