import { BaseAsserter } from "@base/base-asserter";
import { PrivacyPage } from "./privacy-page";
import { step } from "decorators/step";

export class PrivacyPageAsserter extends BaseAsserter<PrivacyPage> {
	public constructor(page: PrivacyPage) {
		super(page);
	}

	@step("Verify user is ignored")
	public async userIsIgnored(username: string): Promise<void> {
		const ignoredUserLocator = this.gamdomPage.map.getIgnoredUser(username);
		await this.checkElementsAreVisible([ignoredUserLocator]);
	}
}
