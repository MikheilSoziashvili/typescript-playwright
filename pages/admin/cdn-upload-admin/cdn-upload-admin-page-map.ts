import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CdnUploadAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get cdnUploaderHeader(): Locator {
		return this.page.locator('h3:text-is("CDN Uploader")');
	}
}
