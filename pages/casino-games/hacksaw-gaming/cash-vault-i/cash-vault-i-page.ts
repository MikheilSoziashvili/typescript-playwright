import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { CashVaultIPageMap } from "./cash-vault-i-page-map";
import { CashVaultIPageAsserter } from "./cash-vault-i-page-asserter";
import { CashVaultIPageSteps } from "./cash-vault-i-page-step";
import accounting from "accounting";
import { step } from "decorators/step";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class CashVaultIPage extends BasePage<CashVaultIPageMap> {
	public constructor(page: Page) {
		super(page, new CashVaultIPageMap(page));
	}

	public override assertThat(): CashVaultIPageAsserter {
		return new CashVaultIPageAsserter(this);
	}

	public steps(): CashVaultIPageSteps {
		return new CashVaultIPageSteps(this);
	}

	@step("Get ingame balance")
	public async getGameBalance(): Promise<number> {
		const text = (await this.map.gameBalance.innerText()).trim();
		return accounting.unformat(text);
	}

	@step("Refresh until game is loaded")
	public async refreshUntilGameIsLoaded(): Promise<void> {
		await waitUntil(
			async () => {
				try {
					await this.assertThat().checkElementsAreVisible(
						[this.map.gameBalance],
						Timeout.EXTRA_SHORT,
					);
					return true;
				} catch {
					await this.refresh();
					return false;
				}
			},
			{
				errorMessage: "Casino game failed to load",
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: Timeout.MEDIUM,
			},
		);
	}
}
