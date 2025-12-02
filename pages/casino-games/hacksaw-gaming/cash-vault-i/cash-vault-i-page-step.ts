import { BasePageStep } from "@pages/base/base-page-step";
import { CashVaultIPage } from "./cash-vault-i-page";
import { waitUntil } from "@core/utils/utils";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class CashVaultIPageSteps extends BasePageStep<CashVaultIPage> {
	public constructor(gamdomPage: CashVaultIPage) {
		super(gamdomPage);
	}

	@step("Refresh until game is loaded")
	public async refreshUntilGameIsLoaded(): Promise<void> {
		await waitUntil(
			async () => {
				try {
					await this.gamdomPage
						.assertThat()
						.checkElementsAreVisible(
							[this.gamdomPage.map.gameBalance],
							Timeout.MEDIUM,
						);
					return true;
				} catch {
					await this.gamdomPage.refresh();
					return false;
				}
			},
			{
				errorMessage: "Casino game failed to load",
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: Timeout.EXTRA_LONG,
			},
		);
	}

	@step("Buy and scratch all cards")
	public async buyAndScratchAllCards(): Promise<void> {
		await this.gamdomPage.assertThat().buyButtonIsVisible();
		await this.gamdomPage.clickBuyButton();
		await this.gamdomPage.assertThat().scratchAllButtonIsVisible();
		await this.gamdomPage.assertThat().buyButtonIsNotVisible();
		await this.gamdomPage.clickScratchAllButton();
		await this.gamdomPage.assertThat().scratchAllButtonIsNotVisible();
		await this.gamdomPage.assertThat().buyButtonIsVisible();
	}
}
