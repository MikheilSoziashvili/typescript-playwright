import { Timeout } from "../../enums/timeout";
import { BaseAsserter } from "../base/base-asserter";
import { HomePage } from "./home-page";
import { expect } from "@playwright/test";
import { formatBalance } from "../../utils";

export class HomePageAsserter extends BaseAsserter<HomePage> {
	public constructor(page: HomePage) {
		super(page);
	}

	private async loggedInUserElementsPresent(): Promise<void> {
		await expect.soft(this.gamdomPage.map.walletBtn).toBeVisible({
			timeout: Timeout.MAX,
		});

		await expect
			.soft(this.gamdomPage.map.balanceDropdownArrow)
			.toBeVisible({
				timeout: Timeout.MAX,
			});
	}

	public async titleHasText(title: string): Promise<void> {
		await expect(this.gamdomPage.page).toHaveTitle(title, {
			timeout: Timeout.MAX,
		});
	}

	public async userIsLoggedIn(): Promise<void> {
		await this.loggedInUserElementsPresent();
		await expect(this.gamdomPage.map.userAvatar).toBeAttached({
			timeout: Timeout.MEDIUM,
		});
	}

	public async toastMessageContainsText(text: string): Promise<void> {
		await expect(this.gamdomPage.map.toastMessage).toContainText(text);
	}

	public async userIsRegistered(username: string): Promise<void> {
		await expect.soft(this.gamdomPage.map.walletBtn).toBeVisible({
			timeout: Timeout.MAX,
		});
		await expect.soft(this.gamdomPage.map.userIcon).toBeVisible({
			timeout: Timeout.MAX,
		});
		await expect
			.soft(this.gamdomPage.map.balanceDropdownArrow)
			.toBeVisible({
				timeout: Timeout.MAX,
			});
		await expect
			.soft(this.gamdomPage.map.registerSuccessMessage)
			.toBeVisible();

		const receivedUsername =
			await this.gamdomPage.map.welcomeBackMessage.textContent({
				timeout: Timeout.MAX,
			});

		expect.soft(receivedUsername?.trim()).toBe(`${username}!`);
	}

	public async accountBalanceIs(amount: number): Promise<void> {
		await expect(await this.gamdomPage.map.accountBalance()).toHaveText(
			`${formatBalance(amount)}`,
			{ timeout: Timeout.MEDIUM },
		);
	}
}
