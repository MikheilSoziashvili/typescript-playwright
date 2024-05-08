import { BasePage } from "@base/base-page";

export class BasePageStep<T extends BasePage> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}
}
