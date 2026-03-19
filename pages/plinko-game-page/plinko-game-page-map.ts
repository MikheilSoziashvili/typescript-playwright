import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PlinkoGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get signInButton(): Locator {
		return this.page.locator("button[class*='Formstyled__SubmitButton']");
	}

	public get signInDialog(): Locator {
		return this.page.getByTestId("auth-modal-form-container");
	}

	public get signInModal(): Locator {
		return this.page.getByTestId("auth-modal-login-dialog");
	}

	public get usernameContainer(): Locator {
		return this.signInDialog.getByTestId("signin-username");
	}

	public get passwordContainer(): Locator {
		return this.signInDialog.getByTestId("signin-password");
	}

	public get usernameField(): Locator {
		return this.usernameContainer.getByTestId("signin-username-input");
	}

	public get passwordField(): Locator {
		return this.passwordContainer.getByTestId("signin-password-input");
	}

	public get partnersSlider(): Locator {
		return this.signInModal.locator(
			"div[class*='AuthModalLayout-styled__SlideBannerBottomContainer']",
		);
	}

	public get plinkoGameWrapper(): Locator {
		return this.page.locator("div[id='inhouse-view']");
	}

	public get leftBetPanelContainer(): Locator {
		return this.plinkoGameWrapper.locator("[class*='Formstyled__Base']");
	}

	public get manualBetButton(): Locator {
		return this.leftBetPanelContainer.locator("button[id*='manual']");
	}

	public get autoBetButton(): Locator {
		return this.leftBetPanelContainer.locator("button[id*='auto']");
	}

	public get startAutobetButton(): Locator {
		return this.leftBetPanelContainer.locator(
			"button[class*='SubmitButton']",
			{ hasText: "Start Autobet" },
		);
	}

	public get stopAutobetButton(): Locator {
		return this.leftBetPanelContainer.locator(
			"button[class*='SubmitButton']",
			{ hasText: "Stop Autobet" },
		);
	}

	public get betAmountInput(): Locator {
		return this.leftBetPanelContainer.getByTestId("originals-bet-amount");
	}

	public get dropBallButton(): Locator {
		return this.page.locator("button[class*='Formstyled__SubmitButton']", {
			hasText: "Drop ball",
		});
	}

	public get userInGameBalance(): Locator {
		return this.leftBetPanelContainer.locator(
			"[class*=Label-] span[class*=Balance-]",
		);
	}

	public get betCountsContainer(): Locator {
		return this.leftBetPanelContainer.locator("label[class*='BetsCount-']");
	}

	public get numberOfBetsInput(): Locator {
		return this.betCountsContainer.locator(
			"input[class*='BetsCountInput']",
		);
	}

	public get remainingBetsContainer(): Locator {
		return this.leftBetPanelContainer.locator(
			"div[class*='RemainingBets-']",
		);
	}

	public get remainingBetsBalanceLabel(): Locator {
		return this.getSpanByClassContains(
			"BetsCountAmount-",
			this.remainingBetsContainer,
		);
	}

	public get plinkoToastMessageContainer(): Locator {
		return this.page.locator("[class*='ToastMessagestyled__TContainer']");
	}

	public get plinkoToastMessageTitle(): Locator {
		return this.plinkoToastMessageContainer.locator(
			"[class*='ToastMessagestyled__THeading']",
		);
	}

	public get plinkoToastMessageSubTitle(): Locator {
		return this.plinkoToastMessageContainer.locator(
			"[class*='ToastMessagestyled__TMessage']",
		);
	}

	public get plinkoAutobetFinishedToastMessage(): Locator {
		return this.page.locator("[class='Toastify__toast-body']", {
			hasText: "Autobet finished",
		});
	}

	public get betRowsSliderContainer(): Locator {
		return this.getSliderContainerByPlaceholder(
			"Rows",
			this.leftBetPanelContainer,
		);
	}

	public get riskRowsSliderContainer(): Locator {
		return this.getSliderContainerByPlaceholder(
			"Risk",
			this.leftBetPanelContainer,
		);
	}

	public get betRowsSliderInput(): Locator {
		return this.getSpanByClassContains(
			"RangeInput-",
			this.betRowsSliderContainer,
		);
	}

	public get riskRowsSliderInput(): Locator {
		return this.getSpanByClassContains(
			"RangeInput-",
			this.riskRowsSliderContainer,
		);
	}

	public get inGameHistoryContainer(): Locator {
		return this.plinkoGameWrapper.locator("[class*='Historystyled__Base']");
	}

	public get inGameChipsHistoryButton(): Locator {
		return this.inGameHistoryContainer.locator(
			"[class*='Historystyled__HistoryChip']",
		);
	}

	private getButtonByText(text: string): Locator {
		return this.page.locator("button[class*='Buttonstyled__Button']", {
			hasText: text,
		});
	}

	public get quickButtonsContainer(): Locator {
		return this.page.locator("div[class*='Formstyled__Options']");
	}

	public get minButton(): Locator {
		return this.quickButtonsContainer.locator("button", { hasText: "Min" });
	}

	public get halfButton(): Locator {
		return this.quickButtonsContainer.locator("button", { hasText: "1/2" });
	}

	public get maxButton(): Locator {
		return this.quickButtonsContainer.locator("button", { hasText: "Max" });
	}

	public get doubleButton(): Locator {
		return this.quickButtonsContainer.locator("button", { hasText: "x2" });
	}

	public get yourBetValue(): Locator {
		return this.page.getByTestId("Plinko-balance");
	}

	public disabledGameMessage(): Locator {
		return this.page.getByText("This game is currently disabled.");
	}

	public get plinkoCoefficientButtons(): Locator {
		return this.page.getByTestId("plinko-coeff-btn");
	}

	public tooltipForCoefficient(coefficient: Locator): Locator {
		return coefficient.getByTestId("plinko-tooltip");
	}

	public tooltipAmountFor(coefficient: Locator): Locator {
		return coefficient.getByTestId("plinko-tooltip-amount");
	}

	public get instantAnimationTooltip(): Locator {
		return this.page.locator('button[data-tooltip="Instant animation"]');
	}
}
