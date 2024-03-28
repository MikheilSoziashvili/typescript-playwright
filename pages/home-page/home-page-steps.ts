import { BasePageStep } from "../../core/helpers/base-page-step";
import { HomePage } from "./home-page";

export class HomePageSteps extends BasePageStep<HomePage> {
	public constructor(gamdomPage: HomePage) {
		super(gamdomPage);
	}

	public async loginUsername(username: string): Promise<void> {
		await this.gamdomPage.navigateAndCheckTitle();
		await this.gamdomPage.openLoginModal();

		await this.gamdomPage.loginModal.loginAsUser(username);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}
}
