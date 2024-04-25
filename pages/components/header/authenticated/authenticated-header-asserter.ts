import { expect } from "@playwright/test";
import { BaseAsserter } from "../../../base/base-asserter";
import { AuthenticatedHeader } from "./authenticated-header";
import { Timeout } from "../../../../enums/timeout";
import { formatBalance } from "../../../../core/utils";

export class AuthenticatedHeaderAsserter extends BaseAsserter<AuthenticatedHeader> {
	public constructor(authenticatedHeader: AuthenticatedHeader) {
		super(authenticatedHeader);
	}

	async loggedInUserElementsAreVisible(): Promise<void> {
		await expect.soft(this.gamdomPage.map.walletBtn).toBeVisible({
			timeout: Timeout.MAX,
		});

		await expect
			.soft(this.gamdomPage.map.balanceDropdownArrow)
			.toBeVisible({
				timeout: Timeout.MAX,
			});

		await expect(this.gamdomPage.map.userAvatar).toBeVisible({
			timeout: Timeout.MEDIUM,
		});
	}

	async loggedInUserElementsAreNotVisible(): Promise<void> {
		await expect.soft(this.gamdomPage.map.walletBtn).not.toBeVisible({
			timeout: Timeout.MAX,
		});

		await expect
			.soft(this.gamdomPage.map.balanceDropdownArrow)
			.not.toBeVisible({
				timeout: Timeout.MAX,
			});

		await expect(this.gamdomPage.map.userAvatar).not.toBeVisible({
			timeout: Timeout.MEDIUM,
		});
	}

	public async accountBalanceIs(amount: number): Promise<void> {
		await expect(await this.gamdomPage.map.accountBalance()).toHaveText(
			`${formatBalance(amount)}`,
			{ timeout: Timeout.MEDIUM },
		);
	}
}
