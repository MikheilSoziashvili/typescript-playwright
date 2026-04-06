import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class WelcomeBannerMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get pageHeading(): Locator {
		return this.page.getByRole("heading", { name: "Welcome banner", exact: true });
	}

	public getLocaleSelector(locale: string): Locator {
		return this.page.getByRole("combobox").filter({ hasText: locale });
	}

	public get desktopBannerSection(): Locator {
		return this.page.locator("div").filter({ hasText: "Desktop banner" }).first();
	}

	public get mobileBannerSection(): Locator {
		return this.page.locator("div").filter({ hasText: "Mobile banner" }).first();
	}

	public get desktopUploadImageButton(): Locator {
		return this.desktopBannerSection.getByRole("button", { name: "Upload new image", exact: true });
	}

	public get mobileUploadImageButton(): Locator {
		return this.mobileBannerSection.getByRole("button", { name: "Upload new image", exact: true });
	}

	public getSaveButton(section: Locator): Locator {
		return section.getByRole("button", { name: "Save", exact: true });
	}

	public getDiscardButton(section: Locator): Locator {
		return section.getByRole("button", { name: "Discard", exact: true });
	}
}
