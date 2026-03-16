import { BaseAsserter } from "@base/base-asserter";
import { LimboGamePage } from "./limbo-game-page";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";

export class LimboGamePageAsserter extends BaseAsserter<LimboGamePage> {
	public constructor(page: LimboGamePage) {
		super(page);
	}

	@step("Roll button is visible")
	public async rollButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.rollButton],
			Timeout.LONG,
		);
	}

	@step("Start playing button is visible")
	public async startPlayingButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.startPlayingButton],
			Timeout.LONG,
		);
	}

	@step("Stop playing button is visible")
	public async stopPlayingButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.stopPlayingButton],
			Timeout.LONG,
		);
	}

	@step("Autobet finished toast is displayed")
	public async autobetFinishedToastIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.autobetFinishedToast,
		]);
	}

	@step("Assert autobet finished toast")
	public async assertAutobetFinishedToast(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.autobetFinishedToast,
			this.gamdomPage.map.autobetFinishedToastTitle,
			this.gamdomPage.map.autobetFinishedToastSubTitle,
		]);
	}
}
