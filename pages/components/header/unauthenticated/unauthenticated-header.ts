import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { UnauthenticatedHeaderMap } from "./unauthenticated-header-map";
import { UnauthenticatedHeaderAsserter } from "./unauthenticated-header-asserter";

export class UnauthenticatedHeader extends BaseComponent<UnauthenticatedHeaderMap> {
	constructor(page: Page) {
		super(page, new UnauthenticatedHeaderMap(page));
	}

	public assertThat(): UnauthenticatedHeaderAsserter {
		return new UnauthenticatedHeaderAsserter(this);
	}

	public async openLoginModal(): Promise<void> {
		await this.map.loginBtn.click();
	}

	public async openRegisterModal(): Promise<void> {
		await this.map.signUpBtn.click();
	}
}
