import { BaseAsserter } from "@base/base-asserter";
import { formatBalance } from "@core/utils/utils";
import { Currency } from "@enums/currencies";
import { CurrencySymbol } from "@enums/currenciesSymbols";
import { NumberSeparators } from "@enums/number-separators";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { expect, TestInfo } from "@playwright/test";
import { step } from "decorators/step";
import { AuthenticatedHeader } from "./authenticated-header";

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
		await this.checkElementsAreVisible([
			this.gamdomPage.map.walletButton,
			this.gamdomPage.map.balanceDropdownArrow,
			this.gamdomPage.map.userAccountMenuAvatar,
		]);
	}

	@step("Logged in user elements are not visible")
	async loggedInUserElementsAreNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.walletButton,
			this.gamdomPage.map.balanceDropdownArrow,
			this.gamdomPage.map.userAccountMenuAvatar,
		]);
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

	@step("User is registered")
	public async userIsRegistered(username: string): Promise<void> {
		await this.loggedInUserElementsAreVisible();

		const receivedUsername =
			await this.gamdomPage.map.userAccountUsername.textContent();

		expect(receivedUsername?.trim()).toBe(username);
	}

	@step("Verify Support and Rewards navigation buttons are visible")
	public async bannedUserAllowedNavigationIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.supportNavigationButton,
			this.gamdomPage.map.rewardsNavigationButton,
		]);
	}

	@step("Verify Casino and Originals navigation buttons are not visible")
	public async bannedUserRestrictedNavigationIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.casinoNavigationButton,
			this.gamdomPage.map.originalGamesMenuLink,
		]);
	}
}
