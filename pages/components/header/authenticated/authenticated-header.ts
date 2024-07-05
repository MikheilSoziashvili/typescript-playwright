import { Page } from "@playwright/test";
import { AuthenticatedHeaderMap } from "./authenticated-header-map";
import { BaseComponent } from "@base/base-component";
import { AuthenticatedHeaderAsserter } from "./authenticated-header-asserter";
import { parseBalance } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { Chat } from "../../chat/chat";
import { Timeout } from "@enums/timeout";

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
			await (await this.map.accountBalance()).innerText(),
		);
	}

	public async expandChatIfNotVisible(): Promise<void> {
		const chat = new Chat(this.page);

		if (
			await this.map.chatButton.isVisible({
				timeout: Timeout.SHORT,
			})
		) {
			await this.map.chatButton.click();
			await chat.waitChatToBeDisplayed();
		} else {
			logger.info("Chat already expanded");
		}
	}
}
