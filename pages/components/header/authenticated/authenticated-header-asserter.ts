import { expect } from "@playwright/test";
import { BaseAsserter } from "base/base-asserter";
import { AuthenticatedHeader } from "./authenticated-header";
import { Timeout } from "enums/timeout";
import { formatBalance } from "core/utils";

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
		await expect
			.soft(await this.gamdomPage.map.accountBalance())
			.toHaveText(`${formatBalance(amount)}`, {
				timeout: Timeout.MEDIUM,
			});
	}
}
