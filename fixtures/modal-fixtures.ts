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
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";
import { UnblockUserModalV4 } from "@pages/modals/unblock-user-modal-v4/unblock-user-modal-v4";
import { UserProfileModalV4 } from "@pages/modals/user-profile-modal-v4/user-profile-modal-v4";

export type Modals = {
	browserSessionManager: BrowserSessionManager;
	tipUserModal: TipUserModal;
	userProfileModal: UserProfileModal;
	userProfileModalV4: UserProfileModalV4;
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
	unblockUserModalV4: UnblockUserModalV4;
};

export const modalsFixtures = base.extend<Modals>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	tipUserModal: sessionAwarePage(TipUserModal),
	userProfileModal: sessionAwarePage(UserProfileModal),
	userProfileModalV4: sessionAwarePage(UserProfileModalV4),
	liveSupportModal: sessionAwarePage(LiveSupportModal),
	walletModal: sessionAwarePage(WalletModal),
	twoFactorAuthModal: sessionAwarePage(TwoFactorAuthModal),
	promoCodeModal: sessionAwarePage(PromoCodeModal),
	tipRainModal: sessionAwarePage(TipRainModal),
	loginModal: sessionAwarePage(LoginModal),
	transactionDetailsModal: sessionAwarePage(TransactionDetailsModal),
	softblockModal: sessionAwarePage(SoftblockModalPage),
	newRedirectModal: sessionAwarePage(NewRedirectModal),
	promotionsModal: sessionAwarePage(PromotionsModal),
	unblockUserModalV4: sessionAwarePage(UnblockUserModalV4),
});
