import { LiveSupportModal } from "@pages/modals/live-support-intercom-modal/live-support-intercom-modal";
import { TipUserModal } from "@pages/modals/tip-user-modal/tip-user-modal";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";
import { UserProfileModal } from "@pages/modals/user-profile-modal/user-profile-modal";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";

import { test as base } from "@playwright/test";

export type Modals = {
	tipUserModal: TipUserModal;
	userProfileModal: UserProfileModal;
	liveSupportModal: LiveSupportModal;
	walletModal: WalletModal;
	twoFactorAuthModal: TwoFactorAuthModal;
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
	walletModal: async ({ page }, use) => {
		await use(new WalletModal(page));
	},
	twoFactorAuthModal: async ({ page }, use) => {
		await use(new TwoFactorAuthModal(page));
	},
});
