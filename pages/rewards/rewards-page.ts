import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { RewardsPageMap } from "./rewards-page-map";
import { RewardsPageAsserter } from "./rewards-page-asserter";
import { PromoCodeModal } from "../modals/promo-code-modal/promo-code-modal";
import { RewardsPageSteps } from "./rewards-page-steps";

export class RewardsPage extends BasePage<RewardsPageMap> {
	public constructor(page: Page) {
		super(page, new RewardsPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto("/rewards");
	}

	public override assertThat(): RewardsPageAsserter {
		return new RewardsPageAsserter(this);
	}

	public steps(): RewardsPageSteps {
		return new RewardsPageSteps(this);
	}

	public get promoCodeModal(): PromoCodeModal {
		return new PromoCodeModal(this.page);
	}

	public async clickActivateNowButton(): Promise<void> {
		await this.map.activateNowButton.click();
	}
}
