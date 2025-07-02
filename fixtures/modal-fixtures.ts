import { LiveSupportModal } from "@pages/modals/live-support-intercom-modal/live-support-intercom-modal";
import { LoginModal } from "@pages/modals/login-modal/login-modal";
import { PromoCodeModal } from "@pages/modals/promo-code-modal/promo-code-modal";
import { TipRainModal } from "@pages/modals/tip-rain-modal/tip-rain-modal";
import { TipUserModal } from "@pages/modals/tip-user-modal/tip-user-modal";
import { TransactionDetailsModal } from "@pages/modals/transaction-details-modal/transaction-details-modal";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";
import { UserProfileModal } from "@pages/modals/user-profile-modal/user-profile-modal";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { SoftblockModalPage } from "@pages/modals/softblock-modal/softblock-modal";
import { test as base } from "@playwright/test";
import { NewRedirectModal } from "@pages/modals/new-redirect-modal/new-redirect-modal";
import { PromotionsModal } from "@pages/modals/promotions-modal/promotions-modal";

export type Modals = {
	tipUserModal: TipUserModal;
	userProfileModal: UserProfileModal;
	liveSupportModal: LiveSupportModal;
	walletModal: WalletModal;
	twoFactorAuthModal: TwoFactorAuthModal;
	promoCodeModal: PromoCodeModal;
	tipRainModal: TipRainModal;
	loginModal: LoginModal;
	transactionDetailsModal: TransactionDetailsModal;
	softblockModal: SoftblockModalPage;
	newRedirectModal: NewRedirectModal;
	promotionsModal: PromotionsModal;
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
	tipRainModal: async ({ page }, use) => {
		await use(new TipRainModal(page));
	},
	promoCodeModal: async ({ page }, use) => {
		await use(new PromoCodeModal(page));
	},
	loginModal: async ({ page }, use) => {
		await use(new LoginModal(page));
	},
	transactionDetailsModal: async ({ page }, use) => {
		await use(new TransactionDetailsModal(page));
	},
	softblockModal: async ({ page }, use) => {
		await use(new SoftblockModalPage(page));
	},
	newRedirectModal: async ({ page }, use) => {
		await use(new NewRedirectModal(page));
	},
	promotionsModal: async ({ page }, use) => {
		await use(new PromotionsModal(page));
	},
});
