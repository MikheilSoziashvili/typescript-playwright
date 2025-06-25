import { OriginalGames } from "@core/types/types";
import { OriginalsHandlerMethods } from "@enums/original-games";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { OriginalsPage } from "./originals-page";

export class OriginalsSteps extends BasePageStep<OriginalsPage> {
	public constructor(
		page: OriginalsPage,
		private readonly handlers = page.handlers,
	) {
		super(page);
	}

	@step("Set bet amount")
	public async setBetAmount(
		game: OriginalGames,
		betAmount: number,
	): Promise<void> {
		const handler = this.handlers[game]?.setBetAmount;
		expect(
			handler,
			`Missing handler for game ${game} and action ${OriginalsHandlerMethods.SetBetAmount}`,
		).toBeDefined();
		if (handler) {
			await handler(betAmount);
		}
	}

	@step("Press min button")
	public async pressMinButton(game: OriginalGames): Promise<void> {
		const handler = this.handlers[game]?.pressMinButton;
		expect(
			handler,
			`Missing handler for game ${game} and action ${OriginalsHandlerMethods.PressMinButton}`,
		).toBeDefined();
		if (handler) {
			await handler();
		}
	}

	@step("Press half button")
	public async pressHalfButton(game: OriginalGames): Promise<void> {
		const handler = this.handlers[game]?.pressHalfButton;
		expect(
			handler,
			`Missing handler for game ${game} and action ${OriginalsHandlerMethods.PressHalfButton}`,
		).toBeDefined();
		if (handler) {
			await handler();
		}
	}

	@step("Get bet amount value")
	public async getBetAmountValue(game: OriginalGames): Promise<string> {
		const handler = this.handlers[game]?.getBetAmountValue;
		expect(
			handler,
			`Missing handler for game ${game} and action ${OriginalsHandlerMethods.GetBetAmountValue}`,
		).toBeDefined();
		return (handler as () => Promise<string>)();
	}
}
