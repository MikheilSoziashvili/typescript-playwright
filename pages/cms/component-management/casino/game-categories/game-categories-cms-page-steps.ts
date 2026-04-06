import { BasePageStep } from "@pages/base/base-page-step";
import { GameCategoriesPage } from "./game-categories-cms-page";

export class GameCategoriesSteps extends BasePageStep<GameCategoriesPage> {
	public constructor(page: GameCategoriesPage) {
		super(page);
	}
}
