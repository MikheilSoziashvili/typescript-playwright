import { Timeout } from "../../enums/timeout";
import { BaseAsserter } from "../base/base-asserter";
import { HomePage } from "./home-page";
import { expect } from "@playwright/test";

export class HomePageAsserter extends BaseAsserter<HomePage> {
	public fromCsv: boolean;
	public constructor(page: HomePage, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	public async titleHasText(title: string): Promise<void> {
		await expect.soft(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
	}

	public async userIsLoggedIn(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
	}

	public async userIsLoggedOut(): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	public async toastMessageContainsText(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await expect.soft(this.gamdomPage.map.toastMessage).toContainText(text);
	}

	public async userIsRegistered(username: string): Promise<void> {
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
		await expect
			.soft(this.gamdomPage.map.registerSuccessMessage)
			.toBeVisible();

		const receivedUsername =
			await this.gamdomPage.map.welcomeBackMessage.textContent({
				timeout: Timeout.MAX,
			});

		expect.soft(receivedUsername?.trim()).toBe(`${username}!`);
	}
}
