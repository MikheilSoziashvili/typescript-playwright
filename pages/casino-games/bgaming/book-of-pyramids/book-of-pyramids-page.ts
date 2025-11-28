import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { BookOfPyramidsPageMap } from "./book-of-pyramids-page-map";
import { BookOfPyramidsPageAsserter } from "./book-of-pyramids-page-asserter";
import { BookOfPyramidsPageSteps } from "./book-of-pyramids-page-step";
import { step } from "decorators/step";
import { parseCurrencyToNumber } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import accounting from "accounting";

export class BookOfPyramidsPage extends BasePage<BookOfPyramidsPageMap> {
	public constructor(page: Page) {
		super(page, new BookOfPyramidsPageMap(page));
	}

	public override assertThat(): BookOfPyramidsPageAsserter {
		return new BookOfPyramidsPageAsserter(this);
	}

	public steps(): BookOfPyramidsPageSteps {
		return new BookOfPyramidsPageSteps(this);
	}

	@step("Click Max Bet button")
	public async clickMaxBet(): Promise<void> {
		const maxBet = this.map.maxBetButton;
		await this.map.waitForVisibility({
			locator: maxBet,
			timeout: Timeout.EXTRA_LONG,
		});
		await maxBet.click();
	}

	@step("Read bet amount from UI")
	public async getBetAmount(): Promise<number> {
		const raw = await this.map.totalBetValue.textContent();
		return parseCurrencyToNumber(raw ?? "0");
	}

	@step("Get in-game balance")
	public async getGameBalance(): Promise<number> {
		const text = (await this.map.gameBalance.innerText()).trim();
		return accounting.unformat(text);
	}
}
