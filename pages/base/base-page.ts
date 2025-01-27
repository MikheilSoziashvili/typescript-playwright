import { AuthenticatedHeader } from "@components/header/authenticated/authenticated-header";
import { UnauthenticatedHeader } from "@components/header/unauthenticated/unauthenticated-header";
import { BasePageNavigationParametersType } from "@core/types/types";
import {
	buildEndpoint,
	conformLinkWithProtocol,
	isElementVisible,
	waitUntil,
} from "@core/utils/utils";
import { Protocol } from "@enums/api/protocols";
import { Directions } from "@enums/directions";
import { Timeout } from "@enums/timeout";
import { WaitUntilState } from "@enums/wait-until-states";
import { Locator, Page } from "@playwright/test";
import { BaseMap } from "./base-map";

type Constructor<T> = new (page: Page) => T;

export abstract class BasePage<T extends BaseMap> {
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

	/**
	 * Updates the BasePage with a new Page instance.
	 * @param newPage The new Page instance.
	 */
	public init(newPage: Page): void {
		this._page = newPage;
		this._map = new (this._map.constructor as Constructor<T>)(newPage);
	}

	public async clearCookies(): Promise<void> {
		await this.page.context().clearCookies();
	}

	public async setExtraHTTPHeaders(
		headers: Record<string, string> = {},
	): Promise<void> {
		await this.page.context().setExtraHTTPHeaders(headers);
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

	async navigateCarouselElementByIndex(
		carouselItem: Locator,
		leftArrow: Locator,
		rightArrow: Locator,
		index: number,
		timeoutMs = Timeout.MAX,
	): Promise<void> {
		const itemCount = await carouselItem.count();

		if (index < 0 || index >= itemCount) {
			throw new Error(
				`Index out of bounds. Valid range: 0 to ${itemCount - 1}`,
			);
		}

		await waitUntil(
			async () => {
				if (await isElementVisible(carouselItem.nth(index))) {
					return true;
				}

				let currentIndex = -1;
				for (let i = 0; i < itemCount; i++) {
					if (await isElementVisible(carouselItem.nth(i))) {
						currentIndex = i;
						break;
					}
				}

				if (currentIndex === -1) {
					throw new Error("No visible item found in the carousel.");
				}

				const direction =
					index > currentIndex ? Directions.RIGHT : Directions.LEFT;

				if (direction === Directions.RIGHT) {
					await rightArrow.click();
				} else {
					await leftArrow.click();
				}

				return false;
			},
			{
				errorMessage: `Timeout exceeded (${timeoutMs}ms). Element at index ${index} was not visible.`,
				timeoutSeconds: timeoutMs / 1000,
				intervalSeconds: 0.1,
			},
		);
	}
}
