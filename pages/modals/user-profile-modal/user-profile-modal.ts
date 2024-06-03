import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { UserProfileModalMap } from "./user-profile-modal-map";
import { UserProfileModalAsserter } from "./user-profile-modal-asserter";
import { VisibilityState } from "@enums/playwright/visibility-states";

export class UserProfileModal extends BaseModal<UserProfileModalMap> {
	constructor(page: Page) {
		super(page, new UserProfileModalMap(page));
	}

	public assertThat(): UserProfileModalAsserter {
		return new UserProfileModalAsserter(this);
	}

	public async waitContentToLoad(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.userAvatar,
			state: VisibilityState.VISIBLE,
		});
		await this.map.waitFor({
			locator: this.map.userProfileTitle,
			state: VisibilityState.VISIBLE,
		});
	}
}
