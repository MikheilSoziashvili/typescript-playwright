import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";
import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { UnauthenticatedHeader } from "@components/header/unauthenticated/unauthenticated-header";
import { conformLinkWithProtocol } from "@core/utils/utils";

export abstract class BasePage<T = BaseMap> {
	readonly page: Page;
	readonly map: T;

	constructor(page: Page, map: T) {
		this.page = page;
		this.map = map;
	}

	abstract navigate(options?: { id?: string; param?: string }): void;
	abstract assertThat(): void;

	public async clearCookies(): Promise<void> {
		await this.page.context().clearCookies();
	}

	public async goToPage(
		link: string,
		cookies: { clearCookies: boolean },
	): Promise<void> {
		if (cookies.clearCookies === true) {
			await this.clearCookies();
		}
		await this.page.goto(conformLinkWithProtocol(link, "https"));
		await this.page.waitForLoadState();
	}

	get authenticatedHeader(): AuthenticatedHeader {
		return new AuthenticatedHeader(this.page);
	}

	get unauthenticatedHeader(): UnauthenticatedHeader {
		return new UnauthenticatedHeader(this.page);
	}

	public steps(): void {
		throw new Error("Method not implemented");
	}

	public async refresh(): Promise<void> {
		await this.page.reload();
	}
}
