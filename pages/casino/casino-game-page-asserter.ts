import { BaseAsserter } from "@base/base-asserter";
import { CasinoPage } from "./casino-game-page";
import { expect } from "playwright/test";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class CasinoPageAsserter extends BaseAsserter<CasinoPage> {
	public constructor(page: CasinoPage) {
		super(page);
	}

	@step("Verify dropdown option visibility")
	private async verifyDropdownOptionVisibility(
		option: GameProvider,
		shouldBeVisible: boolean,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerDropdownOption(option);

		shouldBeVisible
			? await expect(providerOption).toBeVisible()
			: await expect(providerOption).toBeHidden();
	}

	@step("Verify option state")
	public async verifyOptionState(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		const shouldBeVisible = expectedResult === VisibilityOptions.VISIBLE;
		await this.verifyDropdownOptionVisibility(provider, shouldBeVisible);
	}

	@step("Verify that the casino games scrollbar tab is selected")
	public async isCasinoGamesScrollbarTabSelected(
		tabName: string,
	): Promise<void> {
		await this.gamdomPage.map.waitForAttributeToHaveValue(
			this.gamdomPage.map.casinoGamesScrollbarItemByPlaceholder(tabName),
			Attributes.ARIA_SELECTED,
			BooleanValueString.TRUE,
		);
	}
}
