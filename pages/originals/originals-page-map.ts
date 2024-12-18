import { BaseMap } from "@pages/base/base-map";
import { Page } from "playwright";

export class OriginalsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
}
