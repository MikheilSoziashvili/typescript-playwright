import { StepsPerGame } from "@constants/how-to-play-modal-steps";
import { ClientApiInitListener } from "@core/listeners/network-listener/client-api-token-listener";
import { OriginalGames } from "@core/types/types";
import { Currency } from "@enums/currencies";
import { IntervalMs } from "@enums/interval-millisecond";
import { OriginalGame } from "@enums/original-games";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { BaseAsserter } from "@pages/base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { OriginalsPage } from "./originals-page";
import { Unit } from "@enums/units";

export class OriginalsAsserter extends BaseAsserter<OriginalsPage> {
	public constructor(page: OriginalsPage) {
		super(page);
	}

	@step("Assert that the bet amount is correct for game {game}")
	public async betAmountIsCorrect(
		game: OriginalGames,
		expected: number,
	): Promise<void> {
		const actualBetAmount = await this.gamdomPage
			.steps()
			.getBetAmountValue(game, expected);
		this.expectRoundedToBe(actualBetAmount, expected);
	}

	@step("Assert that the bet amount is set to the minimum for {game}")
	public async betAmountIsMin(game: OriginalGame): Promise<void> {
		await this.betAmountIsCorrect(
			game,
			this.gamdomPage.getMinBetAmount(game),
		);
	}

	@step("Assert that the bet amount is set to the maximum for {game}")
	public async betAmountIsMax(game: OriginalGame): Promise<void> {
		await this.betAmountIsCorrect(
			game,
			this.gamdomPage.getMaxBetAmount(game),
		);
	}

	@step("Assert that the bet amount remains unchanged after negative input")
	public async betAmountRemainsUnchangedAfterNegativeInput(
		game: OriginalGame,
		expectedBetAmount: number,
	): Promise<void> {
		const currentBetAmount = await this.gamdomPage
			.steps()
			.getBetAmountValue(game, expectedBetAmount);
		this.expectRoundedToBe(currentBetAmount, expectedBetAmount);
	}

	@step("Live bets section is visible")
	public async liveBetsSectionIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.liveBetsTable]);
	}

	@step("Assert that How to Play modal slider counter shows the correct step")
	public async howToPlayModalSliderCounterShowsCorrectStep(
		currentStep: number,
		game: OriginalGames,
	): Promise<void> {
		const totalSteps = StepsPerGame[game];
		const expectedText = `${currentStep}/${totalSteps}`;

		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.howToPlayModalSliderCounter,
				expectedText: expectedText,
			},
		]);
	}

	@step("Self exclusion toast message is displayed")
	public async selfExclusionToastMessageIsDisplayed(): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.FAILED);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(ToastSubTitle.SELF_EXCLUSION);
	}

	@step("Verify self exclusion page text is displayed")
	public async selfExclusionPageTextIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionText,
		]);
	}

	@step(
		"Final init responses contain and end with the final currency selection",
	)
	public async finalInitResponsesEndWithCurrency(
		listener: ClientApiInitListener,
		sequence: Currency[],
	): Promise<void> {
		if (sequence.length === 0) {
			throw new Error("Currency sequence is empty.");
		}
		const finalCurrency: Currency = sequence[sequence.length - 1];

		await expect
			.poll(() => listener.getLastDisplayCurrency(), {
				timeout: Timeout.EXTRA_SHORT,
				message: `Waiting for last init to reflect final currency ${finalCurrency}.`,
			})
			.toBe(finalCurrency);

		const seen = await listener.getLastDisplayCurrency();

		expect(
			seen,
			`Final currency ${finalCurrency} not present in init responses.`,
		).toContain(finalCurrency);
	}

	@step("Verify balance and 'Your Bet' updated simultaneously")
	async balanceAndYourBetUpdatedSimultaneosly(
		unit: Unit,
		initialAccountBalance: number,
		initialYourBetBalance: number,
		game: OriginalGame,
	): Promise<void> {
		await expect
			.poll(
				async () => {
					const currentAccountBalance =
						await this.userBalanceHandler.walletBalanceInFiatRounded(
							unit,
						);
					const currentYourBetBalance =
						await this.gamdomPage.getYourBetValueForGame(game);

					return {
						balanceChanged:
							currentAccountBalance !== initialAccountBalance,
						yourBetChanged:
							currentYourBetBalance !== initialYourBetBalance,
						valuesMatch:
							currentAccountBalance === currentYourBetBalance,
					};
				},
				{
					timeout: Timeout.MAX,
					intervals: [IntervalMs.SHORT],
				},
			)
			.toMatchObject({
				balanceChanged: true,
				yourBetChanged: true,
				valuesMatch: true,
			});
	}

	@step("Self exclusion toast message is displayed - v4")
	public async selfExclusionToastMessageIsDisplayedV4(): Promise<void> {
		await this.gamdomPage.toastV4
			.assertThat()
			.toastMessageIsV4(
				ToastTitle.FAILED_V4,
				ToastSubTitle.SELF_EXCLUSION,
			);
	}
}
