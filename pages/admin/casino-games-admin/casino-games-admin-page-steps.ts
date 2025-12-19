import { BasePageStep } from "@pages/base/base-page-step";
import { CasinoGamesAdminPage } from "./casino-games-admin-page";
import { step } from "decorators/step";
import { ToggleOptions } from "@enums/visibility-options";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect } from "@playwright/test";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { logger } from "@logger/logger";
import { Locator } from "@playwright/test";

export class CasinoGamesAdminSteps extends BasePageStep<CasinoGamesAdminPage> {
	public constructor(page: CasinoGamesAdminPage) {
		super(page);
	}

	@step("Toggle on/off casino game")
	public async toggleOnOffCasinoGame(
		gameName: string,
		providerName: string,
		action: ToggleOptions,
	): Promise<boolean> {
		const toggle =
			this.gamdomPage.map.toggleOnOffCasinoGameByCasinoNameAndProviderName(
				gameName,
				providerName,
			);

		const isCurrentlyOn = await this.isToggleOn(toggle);
		const shouldBeOn = action === ToggleOptions.ON;

		if (isCurrentlyOn === shouldBeOn) {
			return false;
		}

		await toggle.click();
		return true;
	}

	@step("Is toggle on")
	private async isToggleOn(toggle: Locator): Promise<boolean> {
		const toggleClass = await toggle.getAttribute(Attributes.CLASS);
		expect(toggleClass).toBeDefined();
		return toggleClass?.includes(AttributesValues.CHECKED) ?? false;
	}

	@step("Toggle on/off casino game successfully")
	public async toggleOnOffCasinoGameSuccessfully(
		gameName: string,
		providerName: string,
		action: ToggleOptions,
	): Promise<void> {
		const wasToggled = await this.toggleOnOffCasinoGame(
			gameName,
			providerName,
			action,
		);

		if (wasToggled) {
			await this.clickSaveChangesButton();
		} else {
			logger.info(
				`Casino game "${gameName}" is already in expected state: ${action}`,
			);
		}
	}

	@step("Toggle on/off casino game for multiple providers")
	public async toggleOnOffCasinoGameForProviders(
		gameName: string,
		providerNames: string[],
		action: ToggleOptions,
	): Promise<void> {
		let anyToggled = false;

		for (const providerName of providerNames) {
			const wasToggled = await this.toggleOnOffCasinoGame(
				gameName,
				providerName,
				action,
			);
			anyToggled = anyToggled || wasToggled;
		}

		if (anyToggled) {
			await this.clickSaveChangesButton();
		} else {
			logger.info(
				`Casino game "${gameName}" is already in expected state for all providers: ${action}`,
			);
		}
	}

	@step("Search and toggle on/off casino game for multiple providers")
	public async searchAndToggleOnOffCasinoGameForProviders(
		gameName: string,
		providerNames: string[],
		action: ToggleOptions,
	): Promise<void> {
		await this.gamdomPage.searchCasinoGameByName(gameName);
		await this.toggleOnOffCasinoGameForProviders(
			gameName,
			providerNames,
			action,
		);
	}

	@step("Click save changes button")
	public async clickSaveChangesButton(): Promise<void> {
		await this.gamdomPage.assertThat().saveChangesButtonIsEnabled();
		await this.gamdomPage.map.saveChangesButton.click();
		await this.gamdomPage.assertThat().saveChangesButtonIsDisabled();
	}
}
