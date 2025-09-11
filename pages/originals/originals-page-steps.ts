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
		const multiplier =
			multiplierCell === "-" || multiplierCell === "Crashed"
				? 0
				: parseFloat(
						multiplierCell.replace(currencyToNumberPattern, ""),
				  );

		const payoutCell = await this.gamdomPage.map
			.getPayoutCell(row)
			.innerText();
		const payout = parseFloat(
			payoutCell.replace(currencyToNumberPattern, ""),
		);

		return { betAmount, multiplier, payout };
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
			if (this.isGameWithNegativePayoutOnLoss(game)) {
				expectedPayout = -betAmount;
				logger.info(
					`${game} loss calculation: Expected payout = -${betAmount} = ${expectedPayout}`,
				);
			} else {
				expectedPayout = 0;
				logger.info(
					`${game} loss calculation: Expected payout = $0.00`,
				);
			}
		} else {
			expectedPayout = calculateRoundedExpectedProfit(
				multiplier,
				betAmount,
			);
			logger.info(
				`${game} win calculation: Expected payout = ${expectedPayout}`,
			);
		}

		logger.info(
			`Comparing payout: Expected=${expectedPayout}, Actual=${payout}`,
		);
		expect(payout).toBeCloseTo(expectedPayout, 0);
	}

	private isGameWithNegativePayoutOnLoss(game: OriginalGames): boolean {
		const gamesWithNegativePayout = [OriginalGame.HiLo, OriginalGame.Dice];

		const hasNegativePayout = gamesWithNegativePayout.includes(game);
		logger.info(
			`Game ${game} has negative payout on loss: ${hasNegativePayout}`,
		);
		return hasNegativePayout;
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
}
