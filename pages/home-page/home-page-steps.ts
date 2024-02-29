import { BasePageStep } from "../../core/helpers/base-page-step";
import { BetTestData } from "../../dtos/test-data";
import { HomePage } from "./home-page";

export class HomePageSteps extends BasePageStep<HomePage> {
	public constructor(gamdomPage: HomePage) {
		super(gamdomPage);
	}

	public async loginUsername(username: string) {
		await this.gamdomPage.navigateAndCheckTitle();
		await this.gamdomPage.openLoginModal();

		await this.gamdomPage.loginModal.loginAsUser(username);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}
}
