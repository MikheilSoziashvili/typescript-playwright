import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { UserInfoSessionsAdminPageMap } from "./user-info-sessions-admin-page-map";
import { UserInfoSessionsAdminPageAsserter } from "./user-info-sessions-admin-page-asserter";
import { UserInfoSessionsAdminPageSteps } from "./user-info-sessions-admin-page-steps";
import { step } from "decorators/step";

export class UserInfoSessionsAdminPage extends BasePage<UserInfoSessionsAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoSessionsAdminPageMap(page));
	}

	public override assertThat(): UserInfoSessionsAdminPageAsserter {
		return new UserInfoSessionsAdminPageAsserter(this);
	}

	public steps(): UserInfoSessionsAdminPageSteps {
		return new UserInfoSessionsAdminPageSteps(this);
	}

	@step(`End a user's session by session id`)
	public async endSessionById(sessionId: string): Promise<void> {
		this.acceptDialog({
			expectedMessage: "Are you sure you want to end this session?",
		});
		await this.map.getEndSessionButtonBySessionId(sessionId).click();
	}
}
