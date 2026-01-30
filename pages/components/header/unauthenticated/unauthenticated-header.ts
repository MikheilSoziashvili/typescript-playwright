import { Page } from "@playwright/test";
import { BaseComponent } from "@base/base-component";
import { UnauthenticatedHeaderMap } from "./unauthenticated-header-map";
import { UnauthenticatedHeaderAsserter } from "./unauthenticated-header-asserter";
import { step } from "decorators/step";
import { UnauthenticatedHeaderSteps } from "./unauthenticated-header-steps";
import { Toast } from "@pages/components/toast/toast";

export class UnauthenticatedHeader extends BaseComponent<UnauthenticatedHeaderMap> {
	public readonly toast: Toast;

	constructor(page: Page) {
		super(page, new UnauthenticatedHeaderMap(page));
		this.toast = new Toast(page);
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
}
