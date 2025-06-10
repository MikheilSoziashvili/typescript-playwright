import { BasePageStep } from "@pages/base/base-page-step";
import { KothPage } from "./koth-page";
import { expect } from "@playwright/test";

export class KothSteps extends BasePageStep<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}

	public async navigateToKothEventByName(
		kothEventName: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.kothMainTopbarTabsContainer,
		).toBeVisible();
		await this.gamdomPage.map
			.kothMainTopBarTabByName(kothEventName)
			.first()
			.click();
	}
}
