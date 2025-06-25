import { KOTH_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BoundingBoxCoordinate } from "@enums/bounding-box-coordinates";
import { BasePage } from "@pages/base/base-page";
import { step } from "decorators/step";
import { Page } from "playwright";
import { KothAsserter } from "./koth-page-asserter";
import { KothMap } from "./koth-page-map";
import { KothSteps } from "./koth-page-steps";

export class KothPage extends BasePage<KothMap> {
	public constructor(page: Page) {
		super(page, new KothMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [KOTH_ENDPOINT] },
		});
	}

	@step("Navigate to KOTH event")
	public async navigateToKothEvent(
		kothEventPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [kothEventPageEndpoint] },
		});
	}

	public override assertThat(): KothAsserter {
		return new KothAsserter(this);
	}

	public steps(): KothSteps {
		return new KothSteps(this);
	}

	@step("Get koth banner currency xposition")
	public async getKothBannerCurrencyXPosition(): Promise<number> {
		await this.map.waitForStableXPosition({
			locator: this.map.kothBannerCurrencyAmount,
		});
		return this.getElementPosition(
			this.map.kothBannerCurrencyAmount,
			BoundingBoxCoordinate.X,
		);
	}

	@step("Get koth banner timer xposition")
	public async getKothBannerTimerXPosition(): Promise<number> {
		await this.map.waitForStableXPosition({
			locator: this.map.kothBannerTimerContainer,
		});
		return this.getElementPosition(
			this.map.kothBannerTimerContainer,
			BoundingBoxCoordinate.X,
		);
	}
}
