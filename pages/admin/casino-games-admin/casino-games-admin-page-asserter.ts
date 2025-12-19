import { BaseAsserter } from "@pages/base/base-asserter";
import { CasinoGamesAdminPage } from "./casino-games-admin-page";
import { step } from "decorators/step";

export class CasinoGamesAdminAsserter extends BaseAsserter<CasinoGamesAdminPage> {
	public constructor(page: CasinoGamesAdminPage) {
		super(page);
	}

	@step("Save changes button is disabled")
	public async saveChangesButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.saveChangesButton,
		]);
	}

	@step("Save changes button is enabled")
	public async saveChangesButtonIsEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.saveChangesButton,
		]);
	}
}
