import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class ComponentManagementMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get homePageTab(): Locator {
		return this.page.getByRole("tab", { name: "home page", exact: true });
	}

	public get casinoPageTab(): Locator {
		return this.page.getByRole("tab", { name: "casino page", exact: true });
	}

	public get sportsPageTab(): Locator {
		return this.page.getByRole("tab", { name: "sports page", exact: true });
	}

	public get providersPageTab(): Locator {
		return this.page.getByRole("tab", { name: "providers page", exact: true });
	}

	public getComponentCard(title: string): Locator {
		return this.page
			.locator(".grid")
			.locator("div.rounded-xl")
			.filter({ hasText: title });
	}

	public getEditButtonForCard(title: string): Locator {
		return this.getComponentCard(title).getByRole("button", {
			name: "Edit",
			exact: true,
		});
	}

	public get noResultsMessage(): Locator {
		return this.page.getByText("No results", { exact: true });
	}
}
