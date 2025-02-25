import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { KothAsserter } from "./koth-page-asserter";
import { KothMap } from "./koth-page-map";
import { KothSteps } from "./koth-page-steps";
import { KOTH_ENDPOIT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { BoundingBoxCoordinate } from "@enums/bounding-box-coordinates";

export class KothPage extends BasePage<KothMap> {
	public constructor(page: Page) {
		super(page, new KothMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [KOTH_ENDPOIT] },
		});
	}

	public override assertThat(): KothAsserter {
		return new KothAsserter(this);
	}

	public steps(): KothSteps {
		return new KothSteps(this);
	}

	@step()
	public async getKothBannerCurrencyXPosition(): Promise<number> {
		return this.getElementPosition(
			this.map.kothBannerCurrencyAmount,
			BoundingBoxCoordinate.X,
		);
	}

	@step()
	public async getKothBannerTimerXPosition(): Promise<number> {
		return this.getElementPosition(
			this.map.kothBannerTimerContainer,
			BoundingBoxCoordinate.X,
		);
	}
}
