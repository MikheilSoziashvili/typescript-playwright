import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { AuthenticatedHeader } from "./authenticated-header";
import { Timeout } from "@enums/timeout";
import { formatBalance } from "@core/utils/utils";

export class AuthenticatedHeaderAsserter extends BaseAsserter<AuthenticatedHeader> {
	public constructor(authenticatedHeader: AuthenticatedHeader) {
		super(authenticatedHeader);
	}

	async loggedInUserElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.walletBtn,
				this.gamdomPage.map.balanceDropdownArrow,
				this.gamdomPage.map.userAvatar,
			],
			Timeout.MAX,
		);
	}

	async loggedInUserElementsAreNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible(
			[
				this.gamdomPage.map.walletBtn,
				this.gamdomPage.map.balanceDropdownArrow,
				this.gamdomPage.map.userAvatar,
			],
			Timeout.MAX,
		);
	}

	public async accountBalanceIs(amount: number): Promise<void> {
		await expect(
			await this.gamdomPage.map.getLoadedAccountBalance(),
		).toHaveText(`${formatBalance(amount)}`, {
			timeout: Timeout.LONG,
		});
	}

	public async accountBalanceHasChanged(
		initialBalance: number,
	): Promise<void> {
		await expect(
			await this.gamdomPage.map.getLoadedAccountBalance(),
		).not.toHaveText(`${formatBalance(initialBalance)}`, {
			timeout: Timeout.MEDIUM,
		});
	}
}
