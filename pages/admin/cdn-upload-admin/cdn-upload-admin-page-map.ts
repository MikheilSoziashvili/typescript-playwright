import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CdnUploadAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get cdnUploaderContent(): Locator {
		return this.page.getByTestId("cdnUploaderPageContent");
	}

	public get cdnUploaderHeaderContainer(): Locator {
		return this.cdnUploaderContent.getByTestId("cdnUploaderContainer");
	}

	public get cdnUploaderHeader(): Locator {
		return this.cdnUploaderHeaderContainer.getByTestId(
			"cdnUploaderHeaderTitle",
		);
	}
}
