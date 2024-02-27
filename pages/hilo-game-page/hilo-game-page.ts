import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { HiloGamePageMap } from "./hilo-game-page.map";
import { HiloGamePageAsserter } from "./hilo-game-page-asserter";
import { HILO_GAME_ENDPOINT } from "../../constants/page-endpoints";
import { HiloBetMultiplierByBetOption } from "../../enums/original-games";
import { HiloBetOption } from "../../enums/hilo-bet-options";


export class HiloGamePage extends BasePage<HiloGamePageMap> {
    public constructor(page: Page) {
        super(page, new HiloGamePageMap(page));
    }

    public override async navigate(): Promise<void> {
        await this.page.goto(HILO_GAME_ENDPOINT);
    }

    public override assertThat(): HiloGamePageAsserter {
        return new HiloGamePageAsserter(this)
    }

    public async fillInBetAmount(
        betAmount: number,
    ): Promise<void> {
        await this.map.yourBetField.fill(`${betAmount}`);
    }

    public async placeBet(betOption: HiloBetOption): Promise<void> {
        switch (betOption) {
            case HiloBetOption.RED:
                await this.map.redButton.click()
                break
            case HiloBetOption.BLACK:
                await this.map.blackButton.click()
                break
            default:
                break
        }
    }

    public async waitRoundResult(): Promise<void> {
        await this.map.gamRoundResultLocator.waitFor({ state: 'attached' })
        await this.map.gamRoundResultLocator.waitFor({ state: 'visible' })
    }

    public async getRoundResult(): Promise<string> {
        await this.waitRoundResult()

        return await this.map.gamRoundResultLocator.textContent() || ''
    }

    public calculateProfit(
        betAmount: number,
        hiloBetOptions: HiloBetMultiplierByBetOption,
        includeBetReturn: boolean = true,
    ): number {
        let result: number = 0;
        switch (hiloBetOptions) {
            case HiloBetMultiplierByBetOption.JOKER:
                return betAmount * 24
            case HiloBetMultiplierByBetOption.ACE:
                return betAmount * 12
            case HiloBetMultiplierByBetOption.BIG_SYMBOL:
                return betAmount * 6
            case HiloBetMultiplierByBetOption.SYMBOL:
                return betAmount * 3
            case HiloBetMultiplierByBetOption.BLACK:
            case HiloBetMultiplierByBetOption.RED:
                return betAmount * 2;
            default:
                break
        }

        result = !includeBetReturn ? result - betAmount : result

        return result
    }
}