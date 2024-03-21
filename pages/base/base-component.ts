import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";

export abstract class BaseComponent<T = BaseMap> {
	readonly page: Page;
	readonly map: T;

	constructor(page: Page, map: T) {
		this.page = page;
		this.map = map;
	}

	abstract assertThat(): void;
}
