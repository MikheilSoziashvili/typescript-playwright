import { LiveSupportModal } from "@pages/modals/live-support-intercom-modal/live-support-intercom-modal";
import { TipUserModal } from "@pages/modals/tip-user-modal/tip-user-modal";
import { UserProfileModal } from "@pages/modals/user-profile-modal/user-profile-modal";

import { test as base } from "@playwright/test";

export type Modals = {
	tipUserModal: TipUserModal;
	userProfileModal: UserProfileModal;
	liveSupportModal: LiveSupportModal;
};

export const modalsFixtures = base.extend<Modals>({
	tipUserModal: async ({ page }, use) => {
		await use(new TipUserModal(page));
	},
	userProfileModal: async ({ page }, use) => {
		await use(new UserProfileModal(page));
	},
	liveSupportModal: async ({ page }, use) => {
		await use(new LiveSupportModal(page));
	},
});
