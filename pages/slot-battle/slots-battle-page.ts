import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { SLOTS_BATTLE_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { SlotsBattlePageMap } from "./slots-battle-page-map";
import { SlotsBattlePageAsserter } from "./slots-battle-page-asserter";
import { BasePageNavigationParametersType } from "@core/types/types";

export class SlotsBattlePage extends BasePage<SlotsBattlePageMap> {
	public constructor(page: Page) {
		super(page, new SlotsBattlePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SLOTS_BATTLE_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): SlotsBattlePageAsserter {
		return new SlotsBattlePageAsserter(this);
	}
}
