import { BaseAsserter } from "@base/base-asserter";
import { UnauthenticatedHeader } from "./unauthenticated-header";
import { Timeout } from "@enums/timeout";

export class UnauthenticatedHeaderAsserter extends BaseAsserter<UnauthenticatedHeader> {
	public constructor(unauthenticatedHeader: UnauthenticatedHeader) {
		super(unauthenticatedHeader);
	}

	async loggedOutUserElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.loginBtn, this.gamdomPage.map.signUpBtn],
			Timeout.MAX,
		);
	}
}
