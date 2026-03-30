import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { WagerRequirementPopup } from "./wager-requirement-popup";

export class WagerRequirementPopupAsserter extends BaseAsserter<WagerRequirementPopup> {
	public constructor(popup: WagerRequirementPopup) {
		super(popup);
	}

	@step("Popup is not visible")
	public async popupIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.container,
		]);
	}

	@step("Collapsed popup is displayed")
	public async collapsedPopupIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.title,
			this.gamdomPage.map.activeLabel,
			this.gamdomPage.map.toggleButton,
			this.gamdomPage.map.dragIcon,
		]);
	}

	@step("Expanded content is displayed")
	public async expandedContentIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.accordionContent,
			this.gamdomPage.map.wageredAmount,
			this.gamdomPage.map.targetAmount,
			this.gamdomPage.map.messageText,
		]);
	}

	@step("Wagered amount is")
	public async wageredAmountIs(expectedAmount: string): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.wageredAmount,
				expectedText: expectedAmount,
			},
		]);
	}

	@step("Target amount is")
	public async targetAmountIs(expectedAmount: string): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.targetAmount,
				expectedText: expectedAmount,
			},
		]);
	}

	@step("Message text is displayed")
	public async messageTextIsDisplayed(expectedText: string): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.messageText,
				expectedText: expectedText,
			},
		]);
	}

	@step("Wagered amount increased")
	public async wageredAmountIncreased(
		amountBefore: number,
		amountAfter: number,
	): Promise<void> {
		await this.checkValueIsGreaterThan(
			amountAfter,
			amountBefore,
			"Wagered amount should have increased after placing a bet",
		);
	}
}
