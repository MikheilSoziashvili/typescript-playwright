import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { UnauthenticatedHeaderMap } from "./unauthenticated-header-map";
import { UnauthenticatedHeaderAsserter } from "./unauthenticated-header-asserter";
import { step } from "decorators/step";
import { UnauthenticatedHeaderSteps } from "./unauthenticated-header-steps";

export class UnauthenticatedHeader extends BaseComponent<UnauthenticatedHeaderMap> {
	constructor(page: Page) {
		super(page, new UnauthenticatedHeaderMap(page));
	}

	public assertThat(): UnauthenticatedHeaderAsserter {
		return new UnauthenticatedHeaderAsserter(this);
	}

	public steps(): UnauthenticatedHeaderSteps {
		return new UnauthenticatedHeaderSteps(this);
	}

	@step("Open login modal")
	public async openLoginModal(): Promise<void> {
		await this.map.loginBtn.click();
	}

	@step("Open register modal")
	public async openRegisterModal(): Promise<void> {
		await this.map.signUpBtn.click();
	}

	@step("Open login modal")
	public async openLoginModalV4(): Promise<void> {
		await this.map.loginBtnV4.click();
	}

	@step("Open register modal - v4")
	public async openRegisterModalV4(): Promise<void> {
		await this.map.signUpBtnV4.click();
	}
}
