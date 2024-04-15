import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";

export abstract class BasePage<T = BaseMap> {
	readonly page: Page;
	readonly map: T;

	constructor(page: Page, map: T) {
		this.page = page;
		this.map = map;
	}

	abstract navigate(options?: { id?: string; param?: string }): void;
	abstract assertThat(): void;

	public steps(): void {
		throw new Error("Method not implemented");
	}

	public async refresh(): Promise<void> {
		await this.page.reload();
	}
}
