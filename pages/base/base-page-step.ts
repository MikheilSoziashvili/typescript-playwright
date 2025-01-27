import { BasePage } from "@base/base-page";
import { BaseMap } from "./base-map";

export class BasePageStep<T extends BasePage<U>, U extends BaseMap = BaseMap> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}
}
