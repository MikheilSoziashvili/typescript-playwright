import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { UserInfoSessionsAdminPage } from "./user-info-sessions-admin-page";

export class UserInfoSessionsAdminPageAsserter extends BaseAsserter<UserInfoSessionsAdminPage> {
	public constructor(page: UserInfoSessionsAdminPage) {
		super(page);
	}

	@step("Verify if user sessions is active")
	public async verifySessionIsActive(sessionId: string): Promise<void> {
		const session =
			this.gamdomPage.map.getEndSessionButtonBySessionId(sessionId);
		await this.checkElementsAreVisible([session]);
	}
}
