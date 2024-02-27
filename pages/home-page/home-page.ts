import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { HomePageMap } from "./home-page-map";
import { LoginModal } from "../modals/login-modal/login-modal";
import { HomePageAsserter } from "./home-page-asserter";
import { RegisterModal } from "../modals/register-modal/register-modal";
import { parseBalance } from "../../core/utils";
import { OriginalGame } from "../../enums/original-games";

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
			await this.loginToGoogle();
		}

		await this.assertThat().titleHasText(
			"Gamdom - Top Bitcoin & Crypto Casino!",
		);
	}

	// Temporary solution to authenticate in cloudflare using environment from coder
	public async loginToGoogle(
		username: string = "testautomation@teamgamdom.com",
		password: string = "automation@pass1",
	): Promise<void> {
		await this.map.gEmailField.fill(username);
		await this.map.gMoveForwardBtn.click();
		await this.map.gPasswordField.fill(password);
		await this.map.gPasswordNextBtn.click();
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
