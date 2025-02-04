import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";

type Constructor<T> = new (page: Page) => T;

export abstract class BaseComponent<T extends BaseMap> {
	private _page: Page;
	private _map: T;

	constructor(page: Page, map: T) {
		this._page = page;
		this._map = map;
	}

	get page(): Page {
		return this._page;
	}

	get map(): T {
		return this._map;
	}

	abstract assertThat(): void;

	public async removeFocus(): Promise<void> {
		await this.page.keyboard.press("Tab");
	}

	public init(newPage: Page): void {
		this._page = newPage;
		this._map = new (this._map.constructor as Constructor<T>)(newPage);
	}
}
