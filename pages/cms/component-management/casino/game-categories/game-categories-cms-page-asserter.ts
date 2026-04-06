import { BaseAsserter } from "@pages/base/base-asserter";
import { GameCategoriesPage } from "./game-categories-cms-page";
import { step } from "decorators/step";

export class GameCategoriesAsserter extends BaseAsserter<GameCategoriesPage> {
	public constructor(page: GameCategoriesPage) {
		super(page);
	}

	@step("Verify game categories edit page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.pageHeading]);
	}
}
