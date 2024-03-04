import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { HomePageMap } from "./home-page-map";
import { LoginModal } from "../modals/login-modal/login-modal";
import { HomePageAsserter } from "./home-page-asserter";
import { RegisterModal } from "../modals/register-modal/register-modal";
import { parseBalance } from "../../core/utils";
import { OriginalGame } from "../../enums/original-games";
import { HomePageSteps } from "./home-page-steps";
import { GoogleAuthPage } from "../external/google-auth-page";

export class HomePage extends BasePage<HomePageMap> {
	public constructor(page: Page) {
		super(page, new HomePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto("/");
	}

	public override assertThat(): HomePageAsserter {
		return new HomePageAsserter(this);
	}

	public steps(): HomePageSteps {
		return new HomePageSteps(this);
	}

	public async openLoginModal(): Promise<void> {
		await this.map.loginBtn.click();
	}

	public async openRegisterModal(): Promise<void> {
		await this.map.signUpBtn.click();
	}

	public async navigateAndCheckTitle(): Promise<void> {
		await this.navigate();

		// Applicable only for coder environment
		if (this.page.url().includes("google")) {
			const googleAuthPage = new GoogleAuthPage(this.page)
			await googleAuthPage.loginToGoogle();
		}

		await this.assertThat().titleHasText(
			"Gamdom - Top Bitcoin & Crypto Casino!",
		);
	}

	public async getAccountBalance(): Promise<number> {
		return parseBalance(
			await (await this.map.accountBalance()).innerText(),
		);
	}

	public get loginModal(): LoginModal {
		return new LoginModal(this.page);
	}

	public get registerModal(): RegisterModal {
		return new RegisterModal(this.page);
	}

	public async openGame(game: OriginalGame): Promise<void> {
		await this.map.originalGamesMenuLink.click();
		await this.map.gameSubMenuLink(game).click();
	}
}
