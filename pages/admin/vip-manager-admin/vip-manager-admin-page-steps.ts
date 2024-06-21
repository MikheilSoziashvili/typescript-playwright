import { BasePageStep } from "@pages/base/base-page-step";
import { VipManagerAdminPage } from "./vip-manager-admin-page";

export class VipManagerAdminPageSteps extends BasePageStep<VipManagerAdminPage> {
	public constructor(gamdomPage: VipManagerAdminPage) {
		super(gamdomPage);
	}

	public async getFreeSpins(parameters: {
		userId: number;
		gameName: string;
		freeSpinsRowIndex?: number;
		betAmount: number;
	}): Promise<void> {
		const { userId, gameName, freeSpinsRowIndex, betAmount } = parameters;

		await this.gamdomPage.selectGameToGiveFreeSpins(gameName);
		await this.gamdomPage.map.findGameToGiveFreeSpinsCardUserIdTextInput.fill(
			userId.toString(),
		);
		await this.gamdomPage.map.findGameToGiveFreeSpinsCardUserIdGetButton.click();
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.possibleSpinsCard,
		});

		await this.gamdomPage.giveFreeSpins({
			tableRowIndex: freeSpinsRowIndex ?? 0,
			betAmount: betAmount,
		});
	}
}
