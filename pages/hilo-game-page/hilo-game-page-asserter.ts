import { expect } from "@playwright/test";
import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "../../enums/hilo-result-messages";
import { BaseAsserter } from "../base/base-asserter";
import { HiloGamePage } from "./hilo-game-page";
import { Timeout } from "../../enums/timeout";

export class HiloGamePageAsserter extends BaseAsserter<HiloGamePage> {
	public constructor(page: HiloGamePage) {
		super(page);
	}

	public async gameMessageIs(
		resultMessage: HiloGameStatusMessage,
	): Promise<void> {
		await expect.soft(this.gamdomPage.map.gameStatusLocator).not.toBeEmpty({
			timeout: Timeout.LONG,
		});

		await expect
			.soft(this.gamdomPage.map.gameStatusLocator)
			.toHaveText(resultMessage, { timeout: Timeout.LONG });
	}

	public async gameResultColorIs(
		resultMessage: HiloGameResultColor,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.gamRoundResultLocator)
			.not.toBeEmpty({
				timeout: Timeout.MEDIUM,
			});

		await expect
			.soft(this.gamdomPage.map.gamRoundResultLocator)
			.toContainText(resultMessage, { timeout: Timeout.MEDIUM });
	}
}
