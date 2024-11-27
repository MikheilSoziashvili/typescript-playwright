import { BaseAsserter } from "@base/base-asserter";
import { CasinoPage } from "./casino-game-page";
import { expect } from "playwright/test";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";

export class CasinoPageAsserter extends BaseAsserter<CasinoPage> {
	public constructor(page: CasinoPage) {
		super(page);
	}

	@step()
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

	@step()
	public async verifyOptionState(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		const shouldBeVisible = expectedResult === VisibilityOptions.VISIBLE;
		await this.verifyDropdownOptionVisibility(provider, shouldBeVisible);
	}
}
