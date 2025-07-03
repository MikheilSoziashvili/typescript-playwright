import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { PromoCodeModalAsserter } from "./promo-code-modal-asserter";
import { PromoCodeModalMap } from "./promo-code-modal-map";
import { PromoCodeModalSteps } from "./promo-code-modal-steps";
import { step } from "decorators/step";

export class PromoCodeModal extends BasePage<PromoCodeModalMap> {
	constructor(page: Page) {
		super(page, new PromoCodeModalMap(page));
	}

	public steps(): PromoCodeModalSteps {
		return new PromoCodeModalSteps(this);
	}

	public assertThat(): PromoCodeModalAsserter {
		return new PromoCodeModalAsserter(this);
	}

	@step("Fill promo code fields")
	public async fillPromoCodeFields(
		campaignName: string,
		campaignCode: string,
	): Promise<void> {
		await this.map.campaignNameInput.fill(campaignName);
		await this.map.campaignCodeInput.fill(campaignCode);
	}

	@step("Select game to give free spins promo code")
	public async selectGameToGiveFreeSpinsPromoCode(
		gameTitle: string,
	): Promise<void> {
		await this.map.searchGamesInput.fill(gameTitle);
		await this.map.findGameToGiveFreeSpinsCardGameField.click();
		await this.map.getGameLocatorByTitle(gameTitle).click();
	}
}
