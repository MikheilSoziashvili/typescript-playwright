import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { SlotsBattlePage } from "./slots-battle-page";

export class SlotsBattlePageAsserter extends BaseAsserter<SlotsBattlePage> {
	public constructor(page: SlotsBattlePage) {
		super(page);
	}

	@step("Check page elements are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.createBattleButton,
				this.gamdomPage.map.yourBattlesSection,
				this.gamdomPage.map.activeBattlesSection,
			],
			Timeout.MAX,
		);
	}
}
