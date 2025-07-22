import { BaseComponent } from "@base/base-component";
import { parseBalance } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { Page } from "@playwright/test";
import { Chat } from "../../chat/chat";
import { AuthenticatedHeaderAsserter } from "./authenticated-header-asserter";
import { AuthenticatedHeaderMap } from "./authenticated-header-map";
import { step } from "decorators/step";
import { UserMenuOption } from "@enums/user-menu-options";

export class AuthenticatedHeader extends BaseComponent<AuthenticatedHeaderMap> {
	constructor(page: Page) {
		super(page, new AuthenticatedHeaderMap(page));
	}

	public assertThat(): AuthenticatedHeaderAsserter {
		return new AuthenticatedHeaderAsserter(this);
	}

	@step("Click user profile button")
	public async clickUserProfileButton(): Promise<void> {
		await this.map.userAvatarMenuButton.click();
	}

	@step("Hover on user profile button")
	public async hoverOnUserProfileButton(): Promise<void> {
		await this.map.userAvatarMenuButton.hover();
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

	@step("Get account balance")
	public async getAccountBalance(): Promise<number> {
		return parseBalance(
			await (await this.map.getLoadedAccountBalance()).innerText(),
		);
	}

	@step("Hover on wallet dropdown")
	public async hoverOnWalletDropdown(): Promise<void> {
		await this.map.inGameAccountBalanceContainer.hover();
	}

	@step("Expand chat if not visible")
	public async expandChatIfNotVisible(): Promise<void> {
		const chat = new Chat(this.page);

		try {
			await chat.waitChatToBeDisplayed();
			logger.info("Chat already expanded");
			return;
		} catch {
			logger.info("Chat not expanded, attempting to open it");
		}

		try {
			await this.map.waitForVisibility({
				locator: this.map.chatButton,
				timeout: Timeout.LONG,
			});
		} catch (error) {
			logger.error("Chat button is not visible", error);
			throw new Error("Chat button not found or not clickable", {
				cause: error,
			});
		}

		await this.map.chatButton.click();

		try {
			await chat.waitChatToBeDisplayed();
			logger.info("Chat successfully expanded");
		} catch (error) {
			logger.error("Chat failed to open ", error);
			throw new Error(
				"Chat did not load after clicking the chat button",
				{
					cause: error,
				},
			);
		}
	}

	@step("Click balance dropdown")
	public async clickBalanceDropdown(): Promise<void> {
		await this.map.balanceDropdown.click();
	}

	@step("Change currency")
	public async changeCurrency(currency: string): Promise<void> {
		await this.clickBalanceDropdown();
		await this.map.selectCurrencyOption(currency).click();
	}

	@step("Change wallet")
	public async changeWallet(wallet: string): Promise<void> {
		await this.clickBalanceDropdown();
		await this.map.walletOption(wallet).click();
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
}
