import { BaseComponent } from "@base/base-component";
import { parseBalance } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { Page } from "@playwright/test";
import { Chat } from "../../chat/chat";
import { AuthenticatedHeaderAsserter } from "./authenticated-header-asserter";
import { AuthenticatedHeaderMap } from "./authenticated-header-map";
import { step } from "decorators/step";

export class AuthenticatedHeader extends BaseComponent<AuthenticatedHeaderMap> {
	constructor(page: Page) {
		super(page, new AuthenticatedHeaderMap(page));
	}

	public assertThat(): AuthenticatedHeaderAsserter {
		return new AuthenticatedHeaderAsserter(this);
	}

	public async clickUserProfileButton(): Promise<void> {
		await this.map.userAvatarMenuButton.click();
	}

	public async getAccountBalance(): Promise<number> {
		return parseBalance(
			await (await this.map.getLoadedAccountBalance()).innerText(),
		);
	}

	public async hoverOnWalletDropdown(): Promise<void> {
		await this.map.inGameAccountBalanceContainer.hover();
	}

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

	@step()
	public async clickBalanceDropdown(): Promise<void> {
		await this.map.balanceDropdown.click();
	}

	@step()
	public async changeCurrency(currency: string): Promise<void> {
		await this.clickBalanceDropdown();
		await this.map.selectCurrencyOption(currency).click();
	}

	@step()
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
