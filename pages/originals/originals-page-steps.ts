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
		await this.invokeHandler(
			game,
			OriginalsHandlerMethods.SetBetAmount,
			betAmount,
		);
	}

	@step("Press min button")
	public async pressMinButton(game: OriginalGames): Promise<void> {
		await this.invokeHandler(game, OriginalsHandlerMethods.PressMinButton);
	}

	@step("Press half button")
	public async pressHalfButton(game: OriginalGames): Promise<void> {
		await this.invokeHandler(game, OriginalsHandlerMethods.PressHalfButton);
	}

	@step("Press max button")
	public async pressMaxButton(game: OriginalGames): Promise<void> {
		await this.invokeHandler(game, OriginalsHandlerMethods.PressMaxButton);
	}

	@step("Press double button")
	public async pressDoubleButton(game: OriginalGames): Promise<void> {
		await this.invokeHandler(
			game,
			OriginalsHandlerMethods.PressDoubleButton,
		);
	}

	@step("Invoke handler")
	private async invokeHandler(
		game: OriginalGames,
		method: OriginalsHandlerMethods,
		payload?: unknown,
	): Promise<void> {
		const handler = this.handlers[game]?.[method];
		expect(
			handler,
			`Missing handler for game ${game} and action ${method}`,
		).toBeDefined();
		if (handler) {
			if (payload !== undefined) {
				await (handler as (arg: unknown) => Promise<void>)(payload);
			} else {
				await (handler as () => Promise<void>)();
			}
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
