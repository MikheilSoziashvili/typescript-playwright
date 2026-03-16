import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { LimboGamePageMap } from "./limbo-game-page-map";
import { LimboGamePageAsserter } from "./limbo-game-page-asserter";
import { LimboGamePageSteps } from "./limbo-game-page-steps";
import { LIMBO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { LimboBetTestData } from "@dtos/test-data";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Toast } from "@pages/components/toast/toast";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { logger } from "@logger/logger";

export class LimboGamePage extends BasePage<LimboGamePageMap> {
	public toast: Toast;
	private readonly userBalanceHandler: UserBalanceHandler;

	public constructor(page: Page) {
		super(page, new LimboGamePageMap(page));
		this.toast = new Toast(page);
		this.userBalanceHandler = new UserBalanceHandler(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [LIMBO_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): LimboGamePageAsserter {
		return new LimboGamePageAsserter(this);
	}

	public steps(): LimboGamePageSteps {
		return new LimboGamePageSteps(this);
	}

	@step("Fill bet data")
	public async fillBetData(limboBetData: LimboBetTestData): Promise<void> {
		await this.map.betAmountInput.fill(`${limboBetData.betAmount}`);
		await this.map.multiplierInput.fill(`${limboBetData.multiplier}`);
	}

	@step("Click roll")
	public async clickRoll(): Promise<void> {
		await this.map.rollButton.click();
	}

	@step("Get last result multiplier from history")
	public async getLastResultMultiplier(): Promise<number> {
		const chipText = await this.map.lastHistoryChipValue.textContent();
		const multiplierText = (chipText ?? "0").replace("x", "");
		return parseFloat(multiplierText);
	}

	@step("Switch to auto mode")
	public async switchToAutoMode(): Promise<void> {
		await this.map.autoRollSwitch.click();
	}

	@step("Click start playing")
	public async clickStartPlaying(): Promise<void> {
		await this.map.startPlayingButton.click();
	}

	@step("Click stop playing")
	public async clickStopPlaying(): Promise<void> {
		await this.map.stopPlayingButton.click();
	}

	@step("Wait for autobet to fully stop")
	public async waitForAutobetToFullyStop(): Promise<void> {
		await waitUntil(
			async () => {
				const isDisabled =
					await this.map.startPlayingButton.getAttribute(
						Attributes.DISABLED,
					);
				const isVisible = await this.map.startPlayingButton.isVisible();

				return isVisible && isDisabled === null;
			},
			{
				errorMessage:
					"Start playing button did not become enabled after autobet stop",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Wait for new history chip to appear")
	public async waitForNewHistoryChip(
		previousChipCount: number,
	): Promise<void> {
		await waitUntil(
			async () => {
				const currentCount = await this.map.historyChips.count();
				return currentCount > previousChipCount;
			},
			{
				errorMessage:
					"Game result did not appear in history after rolling",
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}

	@step("Track auto round multipliers")
	public async trackAutoRounds(
		numberOfRounds: number,
	): Promise<number[]> {
		const trackedMultipliers: number[] = [];

		for (let round = 0; round < numberOfRounds; round++) {
			const chipCountBefore = await this.map.historyChips.count();
			await this.waitForNewHistoryChip(chipCountBefore);

			const multiplier = await this.getLastResultMultiplier();
			trackedMultipliers.push(multiplier);
		}

		return trackedMultipliers;
	}

	@step("Detect extra round after stop")
	public async detectExtraRound(
		trackedMultipliers: number[],
	): Promise<void> {
		const latestMultiplier = await this.getLastResultMultiplier();
		const lastTracked = trackedMultipliers[trackedMultipliers.length - 1];

		if (latestMultiplier !== lastTracked) {
			trackedMultipliers.push(latestMultiplier);
			logger.info(`Extra round detected: ${latestMultiplier}x`);
		}
	}

	public calculateExpectedBalance(
		initialCoins: number,
		limboBetData: LimboBetTestData,
		trackedMultipliers: number[],
	): number {
		const betCoins = this.userBalanceHandler.usdToCoinsTrunc(
			limboBetData.betAmount,
		);

		let expectedCoins = initialCoins;
		for (const resultMultiplier of trackedMultipliers) {
			const isWin = resultMultiplier >= limboBetData.multiplier;
			expectedCoins -= betCoins;
			if (isWin) {
				expectedCoins += this.userBalanceHandler.calculatePayoutCoins(
					betCoins,
					limboBetData.multiplier,
				);
			}
		}

		return expectedCoins;
	}

	@step("Wait for expected balance in coins")
	public async waitForExpectedBalanceInCoins(
		expectedCoins: number,
	): Promise<void> {
		await waitUntil(
			async () => {
				const currentCoins =
					await this.userBalanceHandler.walletBalanceInCoins();
				return currentCoins === expectedCoins;
			},
			{
				errorMessage: `Balance did not update to expected ${expectedCoins} coins`,
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.TEN,
			},
		);
	}
}
