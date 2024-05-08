import { Page } from "@playwright/test";
import { BasePage } from "base/base-page";
import { HomePageMap } from "./home-page-map";
import { LoginModal } from "modals/login-modal/login-modal";
import { HomePageAsserter } from "./home-page-asserter";
import { RegisterModal } from "modals/register-modal/register-modal";
import { HomePageSteps } from "./home-page-steps";
import { HOME_PAGE_ENDPOINT } from "constants/page-endpoints";

export class HomePage extends BasePage<HomePageMap> {
	public constructor(page: Page) {
		super(page, new HomePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(HOME_PAGE_ENDPOINT);
		await this.page.waitForLoadState();
	}

	// use this method for proxy servers where retries are needed
	public async tryNavigate(options?: { retries?: number }): Promise<void> {
		const maxRetries = options?.retries || 3;
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await this.page.goto(HOME_PAGE_ENDPOINT);
				return;
			} catch (error) {
				if (error instanceof Error) {
					console.error(
						`Attempt ${attempt} failed: ${error.message}`,
					);
					if (attempt === maxRetries) {
						throw error;
					}
				}
			}
		}
		await this.page.waitForLoadState();
	}

	public override assertThat(fromCsv = false): HomePageAsserter {
		return new HomePageAsserter(this, fromCsv);
	}

	public steps(): HomePageSteps {
		return new HomePageSteps(this);
	}

	public async navigateAndCheckTitle(): Promise<void> {
		await this.navigate();
		await this.assertThat().titleHasText(
			"Gamdom - Top Bitcoin & Crypto Casino!",
		);
	}

	public get loginModal(): LoginModal {
		return new LoginModal(this.page);
	}

	public get registerModal(): RegisterModal {
		return new RegisterModal(this.page);
	}
}
