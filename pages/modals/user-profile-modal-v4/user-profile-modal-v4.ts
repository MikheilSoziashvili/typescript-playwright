import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { UserProfileModalMapV4 } from "./user-profile-modal-map-v4";
import { UserProfileModalAsserterV4 } from "./user-profile-modal-asserter-v4";
import { step } from "decorators/step";

export class UserProfileModalV4 extends BaseModal<UserProfileModalMapV4> {
	constructor(page: Page) {
		super(page, new UserProfileModalMapV4(page));
	}

	public assertThat(): UserProfileModalAsserterV4 {
		return new UserProfileModalAsserterV4(this);
	}

	@step("Wait content to load")
	public async waitContentToLoadV4(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.userAvatarV4,
		});
		await this.map.waitForVisibility({
			locator: this.map.userProfileUsernameV4,
		});
	}
}
