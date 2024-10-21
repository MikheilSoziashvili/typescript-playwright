import { Page } from "@playwright/test";
import { BaseMap } from "./base-map";
import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { UnauthenticatedHeader } from "@components/header/unauthenticated/unauthenticated-header";
import { buildEndpoint, conformLinkWithProtocol } from "@core/utils/utils";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Protocol } from "@enums/api/protocols";

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

	public async refresh(): Promise<void> {
		await this.page.reload();
	}

	/**
	 * Pauses the execution for the specified number of seconds.
	 *
	 * This function introduces an explicit delay in the script using Playwright's
	 * `waitForTimeout` method. **Explicit waits are generally discouraged** as they can
	 * lead to flaky tests and decreased performance. It's recommended to use Playwright's
	 * built-in waiting mechanisms like `waitForSelector`, `waitForResponse`, etc.,
	 * to wait for specific conditions to be met instead of arbitrary timeouts.
	 *
	 * **Note:** Use this function sparingly and only when necessary, as relying on time-based
	 * waits can make your tests less reliable.
	 *
	 * @param {number} seconds - The number of seconds to wait.
	 * @returns {Promise<void>} - A promise that resolves after the specified timeout.
	 *
	 * @example
	 * await this.waitForSeconds(5); // Waits for 5 seconds.
	 */
	public async waitForSeconds(seconds: number): Promise<void> {
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await this.page.waitForTimeout(seconds * 1000);
	}
}
