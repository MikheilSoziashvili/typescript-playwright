import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../../base/base-map";
import { decimalNumber } from "../../../../support/regex-patterns";

export class AuthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get balanceDropdownArrow(): Locator {
		return this.page.locator("i.bal-arrow.icon-angle-down");
	}

	public get walletBtn(): Locator {
		return this.page.locator("a[href='/wallet']");
	}

	public get userAvatarMenuButton(): Locator {
		return this.page.locator("div[class*= UserAvatarWithMenu]");
	}

	public get userAvatar(): Locator {
		return this.page.locator("img[class*='MuiAvatar-img']");
	}

	public get chatButton(): Locator {
		return this.page.locator("button i.icon-Chat");
	}

	public async accountBalance(): Promise<Locator> {
		const accountBalance = await this.waitUntilVisible(
			this.page.locator(
				"div[class*='header'] > div:nth-child(2) > div:nth-child(2) div[style*='tabular']",
			),
		);

		try {
			return await this.waitUntilContainsText(
				accountBalance,
				decimalNumber,
			); //workaround for $0 balance on page load bug
		} catch (error) {
			const msg = "Error resolving account balance";
			if (error instanceof Error) {
				throw new Error(`${msg}: ${error.message}`);
			}
			throw new Error(msg);
		}
	}
}
