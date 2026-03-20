import { BaseMap } from "@base/base-map";
import { InsuranceOption } from "@enums/insurance-option";
import { Locator, Page } from "@playwright/test";

export class BlackjackGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get betAmountInput(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get betAmountOptions(): Locator {
		return this.page.locator(
			"div[class*='BetAmountInputstyled__Options-Blackjack']",
		);
	}

	public get minButton(): Locator {
		return this.betAmountOptions.getByRole("button", { name: "Min" });
	}

	public get playButton(): Locator {
		return this.page.locator(
			"button[class*='BetButtonstyled__Button-Blackjack']",
			{ hasText: "Play" },
		);
	}

	public get doubleButton(): Locator {
		return this.page.locator(
			"button[class*='Buttonstyled__Button-Blackjack'][class*='RoundControlsstyled__Button-Blackjack']",
			{ hasText: "Double" },
		);
	}

	public get insuranceDialog(): Locator {
		return this.page.locator(
			"div[class*='InsuranceDialogstyled__Container-Blackjack'][class*='Boardstyled__InsuranceDialogBoard-Blackjack']",
		);
	}

	public get insuranceButtonsWrapper(): Locator {
		return this.insuranceDialog.locator(
			"div[class*='InsuranceDialogstyled__ButtonsWrapper-Blackjack']",
		);
	}

	public insuranceButton(option: InsuranceOption): Locator {
		return this.insuranceButtonsWrapper.locator("button", {
			hasText: option,
		});
	}

	public get resultBanner(): Locator {
		return this.page.locator(
			"div[class*='ResultBannerstyled__RowContainer-Blackjack']",
		);
	}
}
