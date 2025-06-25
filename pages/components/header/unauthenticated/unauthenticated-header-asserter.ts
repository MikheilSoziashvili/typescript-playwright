import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { UnauthenticatedHeader } from "./unauthenticated-header";

export class UnauthenticatedHeaderAsserter extends BaseAsserter<UnauthenticatedHeader> {
	public constructor(unauthenticatedHeader: UnauthenticatedHeader) {
		super(unauthenticatedHeader);
	}

	@step("Check logged out user elements are visible")
	async loggedOutUserElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.loginBtn, this.gamdomPage.map.signUpBtn],
			Timeout.MAX,
		);
	}

	@step("Check create account button is disabled")
	async isCreateAccountButtonDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([this.gamdomPage.map.signUpBtn]);
	}
}
