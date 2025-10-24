import { OriginalGames } from "@core/types/types";
import { OriginalGame, OriginalsHandlerMethods } from "@enums/original-games";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { OriginalsPage } from "./originals-page";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { currencyToNumberPattern } from "@support/regex-patterns";
import { calculateRoundedExpectedProfit } from "@formulas/betting-calculations";
import { StepsPerGame } from "@constants/how-to-play-modal-steps";
import { Currency } from "@enums/currencies";

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
	public async getBetAmountValue(
		game: OriginalGames,
		expectedAmount: number,
	): Promise<number> {
		const handler = this.handlers[game]?.getBetAmountValue;
		expect(
			handler,
			`Missing handler for game ${game} and action ${OriginalsHandlerMethods.GetBetAmountValue}`,
		).toBeDefined();

		const fetchedBetAmount = handler as () => Promise<string>;
		await expect
			.poll(fetchedBetAmount, {
				timeout: Timeout.EXTRA_SHORT,
				message: `Expected bet amount for game ${game} was not reached within the timeout`,
			})
			.toBe(expectedAmount.toFixed(2));

		return parseFloat(await fetchedBetAmount());
	}

	@step("Verify bet is displayed in live bets section")
	public async verifyBetIsDisplayedInLiveBetsSection(
		game: OriginalGames,
		username: string,
		betAmount: number,
	): Promise<{
		betAmount: number;
		multiplier: number;
		payout: number;
		game: OriginalGames;
	}> {
		await this.gamdomPage.assertThat().liveBetsSectionIsVisible();
		await this.gamdomPage.map.liveBetsTable.scrollIntoViewIfNeeded();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible(
				[this.gamdomPage.map.getBetRowByUserAndGame(username, game)],
				Timeout.MEDIUM,
				`Bet for game ${game} and user ${username} is displayed in live bets section`,
			);

		const { multiplier, payout } = await this.getLiveBetsTableCellValues(
			game,
			username,
			betAmount,
		);

		return {
			betAmount,
			multiplier,
			payout,
			game,
		};
	}

	@step("Get Live bets table cell values")
	public async getLiveBetsTableCellValues(
		game: OriginalGames,
		username: string,
		betAmount: number,
	): Promise<{
		betAmount: number;
		multiplier: number;
		payout: number;
	}> {
		const row = this.gamdomPage.map.getBetRowByUserAndGame(username, game);

		const betCell = await this.gamdomPage.map.getBetCell(row).innerText();
		betAmount = parseFloat(betCell.replace(currencyToNumberPattern, ""));

		const multiplierCell = await this.gamdomPage.map
			.getMultiplierCell(row)
			.innerText();

		const payoutCell = await this.gamdomPage.map
			.getPayoutCell(row)
			.innerText();

		const { multiplier, payout } = this.parseMultiplierAndPayout(
			game,
			multiplierCell,
			payoutCell,
			betAmount,
		);

		return { betAmount, multiplier, payout };
	}

	private parseMultiplierAndPayout(
		game: OriginalGames,
		multiplierCell: string,
		payoutCell: string,
		betAmount: number,
	): { multiplier: number; payout: number } {
		if (this.isMultiplierNotNumber(game, multiplierCell)) {
			return {
				multiplier: 0,
				payout: this.getLossPayoutAmount(game, betAmount),
			};
		}

		return {
			multiplier: parseFloat(
				multiplierCell.replace(currencyToNumberPattern, ""),
			),
			payout: parseFloat(payoutCell.replace(currencyToNumberPattern, "")),
		};
	}

	private isMultiplierNotNumber(
		game: OriginalGames,
		multiplierCell: string,
	): boolean {
		switch (game) {
			case OriginalGame.Crash:
				return multiplierCell === "Crashed";
			case OriginalGame.Dice:
			case OriginalGame.HiLo:
			case OriginalGame.Mines:
			case OriginalGame.Keno:
				return multiplierCell === "-";
			case OriginalGame.Plinko:
			default:
				return false;
		}
	}

	private getLossPayoutAmount(
		game: OriginalGames,
		betAmount: number,
	): number {
		switch (game) {
			case OriginalGame.Dice:
			case OriginalGame.Crash:
			case OriginalGame.HiLo:
				return -betAmount;
			case OriginalGame.Mines:
			case OriginalGame.Keno:
			case OriginalGame.Plinko:
			default:
				return 0;
		}
	}

	@step("Verify payout calculation is correct")
	public async verifyPayoutCalculationIsCorrect(
		betData: {
			betAmount: number;
			multiplier: number;
			payout: number;
		},
		game: OriginalGames,
	): Promise<void> {
		const { betAmount, multiplier, payout } = betData;

		let expectedPayout: number;

		if (multiplier === 0) {
			expectedPayout = this.getLossPayoutAmount(game, betAmount);
		} else {
			expectedPayout = calculateRoundedExpectedProfit(
				multiplier,
				betAmount,
			);
		}
		logger.info(
			`Comparing payout: Expected=${expectedPayout}, Actual=${payout}`,
		);
		expect(payout).toBeCloseTo(expectedPayout, 0);
	}

	@step("Verify How to Play modal and its steps")
	public async verifyHowToPlayModalAndItsSteps(
		game: OriginalGames,
		testInfo: TestInfo,
	): Promise<void> {
		const totalSteps = StepsPerGame[game];

		if (!totalSteps) {
			throw new Error(`No steps defined for game: ${game}`);
		}

		for (let currentStep = 1; currentStep <= totalSteps; currentStep++) {
			await this.gamdomPage
				.assertThat()
				.howToPlayModalSliderCounterShowsCorrectStep(currentStep, game);

			await this.gamdomPage
				.assertThat()
				.checkElementVisualCorrect(
					testInfo,
					this.gamdomPage.map.howToPlayModal,
					{
						screenshotName: `How-to-Play-Modal-${game}-Step-${currentStep}-${testInfo.title}.png`,
					},
				);

			if (currentStep < totalSteps) {
				await this.gamdomPage.clickHowToPlayModalNextButton();
			}
		}
	}

	@step("Handle wallet switch during gameplay")
	public async handleWalletSwitchDuringGameplay(
		game: OriginalGame,
		wallet: string,
	): Promise<void> {
		switch (game) {
			case OriginalGame.Mines: {
				await this.gamdomPage
					.assertThat()
					.checkElementsAreVisible([
						this.gamdomPage.map
							.minesUnfinishedGamePopupContinueButton,
					]);
				await this.gamdomPage.map.minesUnfinishedGamePopupContinueButton.click();
				await this.gamdomPage.waitForGameRoundFinish(game);
				await this.gamdomPage.authenticatedHeader.changeWalletAndCurrency(
					wallet,
					Currency.USD,
				);
				break;
			}
			case OriginalGame.Plinko:
			case OriginalGame.Keno: {
				await this.gamdomPage.waitForGameRoundFinish(game);
				break;
			}
			default: {
				throw new Error(`Unhandled game type: ${String(game)}`);
			}
		}
	}
}
