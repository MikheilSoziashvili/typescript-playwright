import { BaseComponent } from "@base/base-component";
import { parseBalance } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { UserMenuOption } from "@enums/user-menu-options";
import { logger } from "@logger/logger";
import { Page } from "@playwright/test";
import accounting from "accounting";
import { step } from "decorators/step";
import { Chat } from "../../chat/chat";
import { AuthenticatedHeaderAsserter } from "./authenticated-header-asserter";
import { AuthenticatedHeaderMap } from "./authenticated-header-map";

export class AuthenticatedHeader extends BaseComponent<AuthenticatedHeaderMap> {
	constructor(page: Page) {
		super(page, new AuthenticatedHeaderMap(page));
	}

	public assertThat(): AuthenticatedHeaderAsserter {
		return new AuthenticatedHeaderAsserter(this);
	}

	@step("Click user profile button")
	public async clickUserProfileButton(): Promise<void> {
		await this.map.userAccountMenuAvatar.click();
	}

	@step("Hover on user profile button")
	public async hoverOnUserProfileButton(): Promise<void> {
		await this.map.userAccountMenuAvatar.hover();
	}

	@step("Click user profile dropdown item")
	public async clickUserProfileDropdownItem(
		dropdownItem: UserMenuOption,
	): Promise<void> {
		await this.map.userAvatarDropdownItem(dropdownItem).click();
	}

	@step("Navigate to user menu option")
	public async navigateToUserMenuOption(
		userMenuOption: UserMenuOption,
	): Promise<void> {
		await this.hoverOnUserProfileButton();
		await this.clickUserProfileDropdownItem(userMenuOption);
	}

	@step("Hover on wallet dropdown")
	public async hoverOnWalletDropdown(): Promise<void> {
		await this.map.inGameAccountBalanceContainer.hover();
	}

	@step("Expand chat if not visible")
	public async expandChatIfNotVisible(): Promise<void> {
		const chat = new Chat(this.page);

		try {
			await this.map.waitForVisibility({
				locator: this.map.chatButton,
				timeout: Timeout.SHORT,
			});
			await this.map.chatButton.click();
			await chat.waitChatToBeDisplayed();
		} catch {
			logger.info("Chat already expanded");
		}
	}

	@step("Open balance dropdown")
	public async openBalanceDropdown(): Promise<void> {
		await this.map.balanceDropdownArrow.click();
	}

	@step("Close balance dropdown")
	public async closeBalanceDropdown(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.balanceDropdownArrow,
		});

		await this.map.balanceDropdownArrow
			// eslint-disable-next-line playwright/no-force-option -- The wallet overlay covers the header in CI and intercepts pointer events; force is required to reliably close the dropdown.
			.click({ force: true });
	}

	@step("Open wallet settings")
	public async openWalletSettings(): Promise<void> {
		await this.map.walletSettings.click();
	}

	@step("Click providers dropdown in settings modal")
	public async clickCurrencyDropdownInWalletSettingsModal(): Promise<void> {
		await this.map.currencyDropdownInWalletSettingsModal.click();
	}

	@step("Open wallet settings and select currency")
	public async openWalletSettingsAndSelectCurrency(
		currency: string,
	): Promise<void> {
		await this.openWalletSettings();
		await this.clickCurrencyDropdownInWalletSettingsModal();
		await this.map.selectCurrencyOption(currency).click();
		await this.map.saveSettingsButton.click();
	}

	@step("Change currency")
	public async changeCurrency(currency: string): Promise<void> {
		await this.openBalanceDropdown();
		await this.openWalletSettingsAndSelectCurrency(currency);
		await this.closeBalanceDropdown();
	}

	@step("Change multiple currencies rapidly")
	public async changeMultipleCurrencies(
		currencies: string[],
		intervalMs: number,
	): Promise<void> {
		await this.openBalanceDropdown();

		for (const currency of currencies) {
			await this.openWalletSettings();
			await this.clickCurrencyDropdownInWalletSettingsModal();
			await this.map
				.selectCurrencyOption(currency)
				.click({ delay: intervalMs });
			await this.map.saveSettingsButton.click();
		}

		await this.closeBalanceDropdown();
	}

	@step("Change wallet")
	public async changeWallet(wallet: string): Promise<void> {
		await this.openBalanceDropdown();
		await this.map.walletOption(wallet).click();
		await this.closeBalanceDropdown();
	}

	@step("Change wallet and currency")
	public async changeWalletAndCurrency(
		wallet: string,
		currency: string,
	): Promise<void> {
		await this.changeWallet(wallet);
		await this.changeCurrency(currency);
	}

	@step("Get wallet balance")
	public async getWalletBalance(cryptoCurrency: string): Promise<string> {
		const text = await this.map
			.walletBalanceValue(cryptoCurrency)
			.textContent();

		if (!text) {
			throw new Error(`Balance not found for ${cryptoCurrency}`);
		}
		return text;
	}

	@step("Get account balance while in a casino game")
	public async getAccountBalanceInCasinoGame(): Promise<number> {
		const raw = await this.map.accountBalanceValueInCasinoGame.innerText();
		return accounting.unformat(raw);
	}

	@step("Get account balance")
	public async getAccountBalance(): Promise<number> {
		return parseBalance(
			await (await this.map.getLoadedAccountBalance()).innerText(),
		);
	}
}
