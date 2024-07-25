import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { VIP_MANAGER_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { VipManagerAdminPageMap } from "./vip-manager-admin-page-map";
import { VipManagerAdminPageAsserter } from "./vip-manager-admin-page-asserter";
import { VipManagerAdminPageSteps } from "./vip-manager-admin-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";

export class VipManagerAdminPage extends BasePage<VipManagerAdminPageMap> {
	public constructor(page: Page) {
		super(page, new VipManagerAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { path: VIP_MANAGER_ADMIN_PAGE_ENDPOINT },
		});
	}

	public override assertThat(): VipManagerAdminPageAsserter {
		return new VipManagerAdminPageAsserter(this);
	}

	public steps(): VipManagerAdminPageSteps {
		return new VipManagerAdminPageSteps(this);
	}

	public async selectGameToGiveFreeSpins(gameTitle: string): Promise<void> {
		await this.map.findGameToGiveFreeSpinsCardGameTextInput.fill(gameTitle);
		await this.map.findGameToGiveFreeSpinsCardGameField.click();
		await this.map.waitForVisibility({ locator: this.map.gamesList });
		await this.map.getGameLocatorByTitle(gameTitle).click();
	}

	public async giveFreeSpins(parameters: {
		tableRowIndex: number;
		betAmount: number;
	}): Promise<void> {
		const { tableRowIndex, betAmount } = parameters;
		await this.map
			.getPossibleSpinsTableBetCountTextInput(tableRowIndex)
			.fill(betAmount.toString());
		await this.map
			.getPossibleSpinsTableBetCountGiveButton(tableRowIndex)
			.click();
	}
}
