import { BaseAsserter } from "@base/base-asserter";
import { ProvidersPage } from "./providers-page";
import { GameProvider } from "@enums/game-providers";
import { expect } from "playwright/test";
import { VisibilityResult } from "@core/types/types";
import { VisibilityOptions } from "@enums/visibility-options";
import { step } from "decorators/step";

export class ProvidersPageAsserter extends BaseAsserter<ProvidersPage> {
	public constructor(page: ProvidersPage) {
		super(page);
	}

	@step("Verify provider option displayed")
	public async verifyProviderOptionDisplayed(
		option: GameProvider,
		shouldBeVisible: boolean,
	): Promise<void> {
		const providerOption =
			this.gamdomPage.map.providerInProvidersContainer(option);

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
		await this.verifyProviderOptionDisplayed(provider, shouldBeVisible);
	}
}
