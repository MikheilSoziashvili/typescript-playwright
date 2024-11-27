import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";
import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { UnauthenticatedHeader } from "@components/header/unauthenticated/unauthenticated-header";
import { buildEndpoint, conformLinkWithProtocol } from "@core/utils/utils";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Protocol } from "@enums/api/protocols";
import { WaitUntilState } from "@enums/wait-until-states";

export abstract class BasePage<T = BaseMap> {
	readonly page: Page;
	readonly map: T;

	constructor(page: Page, map: T) {
		this.page = page;
		this.map = map;
	}

	abstract assertThat(): void;

	public async clearCookies(): Promise<void> {
		await this.page.context().clearCookies();
	}

	public async navigate(
		parameters: BasePageNavigationParametersType,
	): Promise<void> {
		if (parameters.cookies?.clearCookies === true) {
			await this.clearCookies();
		}
		if (parameters.endpoint) {
			await this.page.goto(buildEndpoint(parameters.endpoint));
		}
		if (parameters.link) {
			await this.page.goto(
				conformLinkWithProtocol(parameters.link, Protocol.HTTPS),
			);
		}
		await this.page.waitForLoadState();
	}

	public async closePage(): Promise<void> {
		await this.page.close();
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

	public async refresh(
		waitUntil: WaitUntilState = WaitUntilState.DOM_CONTENT_LOADED,
	): Promise<void> {
		await this.page.reload({ waitUntil });
	}
}
