import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { GameCategoriesMap } from "./game-categories-cms-page-map";
import { GameCategoriesAsserter } from "./game-categories-cms-page-asserter";
import { GameCategoriesSteps } from "./game-categories-cms-page-steps";
import { CMS_CASINO_GAME_CATEGORIES_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class GameCategoriesPage extends BasePage<GameCategoriesMap> {
	public constructor(page: Page) {
		super(page, new GameCategoriesMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_CASINO_GAME_CATEGORIES_ENDPOINT] },
		});
	}

	public override assertThat(): GameCategoriesAsserter {
		return new GameCategoriesAsserter(this);
	}

	public steps(): GameCategoriesSteps {
		return new GameCategoriesSteps(this);
	}
}
