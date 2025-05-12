import { BaseAsserter } from "@base/base-asserter";
import { formatBalance } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { AuthenticatedHeader } from "./authenticated-header";

export class AuthenticatedHeaderAsserter extends BaseAsserter<AuthenticatedHeader> {
	public constructor(authenticatedHeader: AuthenticatedHeader) {
		super(authenticatedHeader);
	}

	@step()
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

	@step()
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

	@step()
	public async accountBalanceIs(amount: number): Promise<void> {
		await expect(
			await this.gamdomPage.map.getLoadedAccountBalance(),
		).toHaveText(`${formatBalance(amount)}`, {
			timeout: Timeout.LONG,
		});
	}

	@step()
	public async accountBalanceHasChanged(
		initialBalance: number,
	): Promise<void> {
		await expect(
			await this.gamdomPage.map.getLoadedAccountBalance(),
		).not.toHaveText(`${formatBalance(initialBalance)}`);
	}

	@step()
	public async walletAmountIsVisualDisplayed(
		testInfo: TestInfo,
	): Promise<void> {
		await this.gamdomPage.map.getLoadedAccountBalance();
		await this.verifyVisualDisplay(
			testInfo,
			this.gamdomPage.map.inGameAccountBalance,
			{
				waitedElement:
					this.gamdomPage.map.inGameAccountBalanceContainer,
				locatorName: "inGameAccountBalance",
			},
		);
	}

	@step()
	public async playingStringIsVisualDisplayed(
		testInfo: TestInfo,
	): Promise<void> {
		await this.verifyVisualDisplay(
			testInfo,
			this.gamdomPage.map.inGameBalancePlayingStatus,
			{
				waitedElement:
					this.gamdomPage.map.inGameAccountBalanceContainer,
				locatorName: "inGameBalancePlayingStatus",
			},
		);
	}

	@step()
	public async walletBalanceIs(
		wallet: string,
		expectedAmount: number,
	): Promise<void> {
		const balance = parseFloat(
			await this.gamdomPage.getWalletBalance(wallet),
		);
		expect(balance).toBeCloseTo(expectedAmount, 5);
	}

	@step()
	public async verifyUserProfileDropdownMenuIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userAvatarDropdownMenuContainer,
		]);
	}
}
