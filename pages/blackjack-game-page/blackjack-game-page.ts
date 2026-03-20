import { BLACKJACK_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { InsuranceOption } from "@enums/insurance-option";
import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BlackjackGamePageAsserter } from "./blackjack-game-page-asserter";
import { BlackjackGamePageMap } from "./blackjack-game-page-map";
import { BlackjackGamePageSteps } from "./blackjack-game-page-steps";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";

export class BlackjackGamePage extends BasePage<BlackjackGamePageMap> {
	public constructor(page: Page) {
		super(page, new BlackjackGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [BLACKJACK_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): BlackjackGamePageAsserter {
		return new BlackjackGamePageAsserter(this);
	}

	public steps(): BlackjackGamePageSteps {
		return new BlackjackGamePageSteps(this);
	}

	@step("Press MIN button")
	public async pressMinButton(): Promise<void> {
		await this.map.minButton.click();
	}

	@step("Click Play")
	public async clickPlay(): Promise<void> {
		await this.map.playButton.click();
	}

	@step("Handle insurance if prompted")
	public async handleInsuranceIfPrompted(
		option: InsuranceOption,
	): Promise<void> {
		try {
			await this.map.insuranceDialog.waitFor({
				state: VisibilityState.VISIBLE,
				timeout: Timeout.EXTRA_SHORT,
			});
			await this.map.insuranceButton(option).click();
		} catch {
			// Insurance dialog did not appear — proceed
		}
	}

	@step("Click Double if round is still active")
	public async clickDoubleIfActive(): Promise<void> {
		if (await this.map.resultBanner.isVisible()) {
			return;
		}
		await this.map.doubleButton.click();
	}

	@step("Click Double")
	public async clickDouble(): Promise<void> {
		await this.map.doubleButton.click();
	}

	@step("Place a single bet and finish round")
	public async placeSingleBet(
		insuranceOption: InsuranceOption = InsuranceOption.Yes,
	): Promise<void> {
		await this.clickPlay();
		await this.handleInsuranceIfPrompted(insuranceOption);
		await this.clickDoubleIfActive();
	}
}
