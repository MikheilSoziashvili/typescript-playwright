import { expect } from "@playwright/test";
import { BaseAsserter } from "../../../base/base-asserter";
import { UnauthenticatedHeader } from "./unauthenticated-header";
import { Timeout } from "../../../../enums/timeout";

export class UnauthenticatedHeaderAsserter extends BaseAsserter<UnauthenticatedHeader> {
	public constructor(unauthenticatedHeader: UnauthenticatedHeader) {
		super(unauthenticatedHeader);
	}

	async loggedOutUserElementsAreVisible(): Promise<void> {
		await expect.soft(this.gamdomPage.map.loginBtn).toBeVisible({
			timeout: Timeout.MAX,
		});

		await expect.soft(this.gamdomPage.map.signUpBtn).toBeVisible({
			timeout: Timeout.MAX,
		});
	}
}
