import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";
import { BasePageStep } from "../../core/helpers/base-page-step";

export abstract class BasePage<T = BaseMap> {
	readonly page: Page;
	readonly map: T;

	constructor(page: Page, map: T) {
		this.page = page;
		this.map = map;
	}

	abstract navigate(): void;
	abstract assertThat(): void;

	public steps(): void {
		throw new Error("Method not implemented");
	}
}
