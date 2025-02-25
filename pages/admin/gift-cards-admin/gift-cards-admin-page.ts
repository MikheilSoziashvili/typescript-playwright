import { GIFT_CARDS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { GiftCardsAdminAsserter } from "./gift-cards-admin-page-asserter";
import { GiftCardsAdminMap } from "./gift-cards-admin-page-map";
import { GiftCardsAdminSteps } from "./gift-cards-admin-page-steps";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";

export class GiftCardsAdminPage extends BasePage<GiftCardsAdminMap> {
	public constructor(page: Page) {
		super(page, new GiftCardsAdminMap(page));
	}

	public override assertThat(): GiftCardsAdminAsserter {
		return new GiftCardsAdminAsserter(this);
	}

	public steps(): GiftCardsAdminSteps {
		return new GiftCardsAdminSteps(this);
	}

	public get twoFactorAuthModal(): TwoFactorAuthModal {
		return new TwoFactorAuthModal(this.page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [GIFT_CARDS_PAGE_ENDPOINT] },
		});
	}
}
