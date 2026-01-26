import { BaseAsserter } from "@base/base-asserter";
import { formatBalance } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { AuthenticatedHeader } from "./authenticated-header";
import { CurrencySymbol } from "@enums/currenciesSymbols";
import { NumberSeparators } from "@enums/number-separators";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";

export class AuthenticatedHeaderAsserter extends BaseAsserter<AuthenticatedHeader> {
	public constructor(authenticatedHeader: AuthenticatedHeader) {
		super(authenticatedHeader);
	}

	private formatUSD(value: number): string {
		return formatBalance(
			value,
			CurrencySymbol.USD,
			2,
			NumberSeparators.THOUSAND,
			NumberSeparators.DECIMAL,
		);
	}

	@step("Logged in user elements are visible")
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

	@step("Logged in user elements are not visible")
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

	@step("Account balance is")
	public async accountBalanceIs(
		amount: number,
		unit: Unit = Unit.COINS,
		currency = Currency.USD,
		type: WalletType = WalletType.DEFAULT,
		headers?: Record<string, string>,
	): Promise<void> {
		const expectedBalance =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				currency,
				type,
				headers,
			);
		expect(expectedBalance).toBe(amount);
	}

	@step("Account balance has changed")
	public async accountBalanceHasChanged(
		initialBalance: number,
	): Promise<void> {
		await expect(
			await this.gamdomPage.map.getLoadedAccountBalance(),
		).not.toHaveText(this.formatUSD(initialBalance));
	}

	@step("Wallet amount is visual displayed")
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

	@step("Playing string is visual displayed")
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

	@step("Wallet balance is")
	public async walletBalanceIs(
		wallet: string,
		expectedAmount: number,
	): Promise<void> {
		const balance = parseFloat(
			await this.gamdomPage.getWalletBalance(wallet),
		);
		expect(balance).toBeCloseTo(expectedAmount, 5);
	}

	@step("Verify user profile dropdown menu is displayed")
	public async verifyUserProfileDropdownMenuIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userAvatarDropdownMenuContainer,
		]);
	}

	@step("Logged in user elements are visible - v4")
	async loggedInUserElementsAreVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.walletButtonV4,
			this.gamdomPage.map.accountBalanceV4,
			this.gamdomPage.map.userAccountMenuAvatarV4,
		]);
	}

	@step("User is registered - v4")
	public async userIsRegisteredV4(username: string): Promise<void> {
		await this.loggedInUserElementsAreVisibleV4();

		const receivedUsername =
			await this.gamdomPage.map.userAccountUsernameV4.textContent();

		expect(receivedUsername?.trim()).toBe(username);
	}

	@step("Logged in user elements are not visible - v4")
	async loggedInUserElementsAreNotVisibleV4(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.walletButtonV4,
			this.gamdomPage.map.accountBalanceV4,
			this.gamdomPage.map.userAccountMenuAvatarV4,
		]);
	}
}
