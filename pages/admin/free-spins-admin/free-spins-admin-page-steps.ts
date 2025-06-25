import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { FreeSpinsAdminPage } from "./free-spins-admin-page";

export class FreeSpinsAdminPageSteps extends BasePageStep<FreeSpinsAdminPage> {
	public constructor(gamdomPage: FreeSpinsAdminPage) {
		super(gamdomPage);
	}

	@step("Get free spins for user")
	public async getFreeSpins(parameters: {
		userId?: number;
		gameName: string;
		freeSpinsRowIndex?: number;
		betAmount: number;
	}): Promise<void> {
		const { userId, gameName, freeSpinsRowIndex, betAmount } = parameters;

		await this.gamdomPage.selectGameToGiveFreeSpins(gameName);
		if (userId !== undefined) {
			await this.gamdomPage.map.findGameToGiveFreeSpinsCardUserIdTextInput.fill(
				userId.toString(),
			);
		}
		await this.gamdomPage.map.findGameToGiveFreeSpinsCardUserIdGetButton.click();
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.possibleSpinsCard,
		});

		await this.gamdomPage.giveFreeSpins({
			tableRowIndex: freeSpinsRowIndex ?? 0,
			betAmount: betAmount,
		});
	}

	@step("Upload batch free spins file")
	public async uploadBatchFreeSpinsFile(filePath: string): Promise<void> {
		await this.gamdomPage.map.batchModeCheckbox.check();
		await this.gamdomPage.map.inputFileBatchFreeSpins.setInputFiles(
			filePath,
		);
	}
}
