import { test as base } from "@playwright/test";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { PlinkoBetTestFlow } from "@test-flows/originals/plinko/plinko-bet-test-flow";
import { PlinkoBalanceVerificationFlow } from "@test-flows/originals/plinko/plinko-balance-verification-test-flow";
import { PlinkoBetExecutionFlow } from "@test-flows/originals/plinko/plinko-bet-execution-test-flow";
import { PlinkoUserSetupFlow } from "@test-flows/originals/plinko/plinko-user-setup-test-flow";
import { XpChallengeTestFlow } from "@test-flows/rewards/xp-challenge-test-flow";
import { XpChallengeAdminSetupFlow } from "@test-flows/rewards/xp-challenge-admin-setup-test-flow";
import { XpChallengeActivationFlow } from "@test-flows/rewards/xp-challenge-activation-test-flow";
import { XpChallengeCompletionFlow } from "@test-flows/rewards/xp-challenge-completion-test-flow";
import { ReloadRewardTestFlow } from "@test-flows/rewards/reload-reward-test-flow";
import { ReloadRewardAdminSetupFlow } from "@test-flows/rewards/reload-reward-admin-setup-test-flow";
import { ReloadRewardActivationFlow } from "@test-flows/rewards/reload-reward-activation-test-flow";
import { PromotionTestFlow } from "@test-flows/promotions/promotion-test-flow";
import { PromotionSetupFlow } from "@test-flows/promotions/promotion-setup-test-flow";
import { PromotionCreationFlow } from "@test-flows/promotions/promotion-creation-test-flow";
import { PromotionVisibilityVerificationFlow } from "@test-flows/promotions/promotion-visibility-verification-test-flow";
import { GamdomDb } from "database/gamdom-db";
import { RandomDataSource } from "test-data/core/random-data-source";
import { ObjectDataSource } from "test-data/core/object-data-source";
import { CryptoAdminSetupTestFlow } from "@test-flows/crypto/crypto-admin-setup-test-flow";
import { CryptoDepositTestFlow } from "@test-flows/crypto/crypto-deposit-test-flow";
import { CryptoDepositVerificationTestFlow } from "@test-flows/crypto/crypto-deposit-verification-test-flow";
import { CryptoWithdrawalSetupTestFlow } from "@test-flows/crypto/crypto-withdrawal-setup-test-flow";
import { CryptoWithdrawalProcessTestFlow } from "@test-flows/crypto/crypto-withdrawal-process-test-flow";
import { CryptoWithdrawalVerificationTestFlow } from "@test-flows/crypto/crypto-withdrawal-verification-test-flow";
import { CryptoFlowDependencies } from "@test-flows/crypto/types/crypto-flow-types";
import { CryptoAdminPage } from "@pages/admin/crypto-admin/crypto-admin-page";
import { HomePage } from "@pages/home-page/home-page";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { TransactionsPage } from "@pages/transactions/transactions-page";
import { TransactionDetailsModal } from "@pages/modals/transaction-details-modal/transaction-details-modal";
import { Toast } from "@pages/components/toast/toast";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { UserInfoTransactionsAdminPage } from "@pages/admin/user-info-admin/user-info-transactions-admin/user-info-transactions-admin-page";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { GamdomApi } from "@api/gamdom-api";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";
import { ChangeReloadRewardTestFlow } from "@test-flows/rewards/change-reload-reward-test-flow";
import { ClaimReloadRewardTestFlow } from "@test-flows/rewards/claim-reload-reward-test-flow";
import { VerifyReloadRewardPresenceTestFlow } from "@test-flows/rewards/verify-reload-reward-presence-test-flow";
import { UserInfoStaffUserSetupFlow } from "@test-flows/user-info/user-info-staff-user-setup-test-flow";
import { UserInfoEditFieldFlow } from "@test-flows/user-info/user-info-edit-field-test-flow";
import { SteamUserLoginLogoutFlow } from "@test-flows/ban/steam-user-login-logout-test-flow";
import { BanUserVerificationFlow } from "@test-flows/ban/ban-user-verification-test-flow";
import { PasswordChangeSetupTestFlow } from "@test-flows/password/password-change-setup-test-flow";
import { PasswordChangeExecutionTestFlow } from "@test-flows/password/password-change-execution-test-flow";
import { ClaimReloadRewardAndVerifyClaimsTestFlow } from "@test-flows/rewards/claim-reload-reward-and-verify-claims-test-flow";
import { VerifyReloadRewardPresenceAndClaimsTestFlow } from "@test-flows/rewards/verify-reload-reward-presence-and-claims-test-flow";
import { VerifyAndClaimReloadRewardTestFlow } from "@test-flows/rewards/verify-and-claim-reload-reward-test-flow";
import { VerifyReloadUpdateLogicTestFlow } from "@test-flows/rewards/verify-reload-update-logic-test-flow";
import { LimboAutobetTestFlow } from "@test-flows/originals/limbo/limbo-autobet-test-flow";
import { LimboAutobetSetupFlow } from "@test-flows/originals/limbo/limbo-autobet-setup-test-flow";
import { LimboAutobetExecutionFlow } from "@test-flows/originals/limbo/limbo-autobet-execution-test-flow";

export type TestFlowsFixtures = {
	plinkoBetTestFlow: PlinkoBetTestFlow;
	xpChallengeTestFlow: XpChallengeTestFlow;
	reloadRewardTestFlow: ReloadRewardTestFlow;
	promotionTestFlow: PromotionTestFlow;
	promotionVisibilityVerificationFlow: PromotionVisibilityVerificationFlow;
	cryptoAdminSetupTestFlow: CryptoAdminSetupTestFlow;
	cryptoFlowDeps: CryptoFlowDependencies;
	cryptoDepositTestFlow: CryptoDepositTestFlow;
	cryptoDepositVerificationTestFlow: CryptoDepositVerificationTestFlow;
	cryptoWithdrawalSetupTestFlow: CryptoWithdrawalSetupTestFlow;
	cryptoWithdrawalProcessTestFlow: CryptoWithdrawalProcessTestFlow;
	cryptoWithdrawalVerificationTestFlow: CryptoWithdrawalVerificationTestFlow;
	changeReloadRewardTestFlow: ChangeReloadRewardTestFlow;
	claimReloadRewardTestFlow: ClaimReloadRewardTestFlow;
	verifyReloadRewardPresenceTestFlow: VerifyReloadRewardPresenceTestFlow;
	userInfoStaffUserSetupFlow: UserInfoStaffUserSetupFlow;
	userInfoEditFieldFlow: UserInfoEditFieldFlow;
	steamUserLoginLogoutFlow: SteamUserLoginLogoutFlow;
	banUserVerificationFlow: BanUserVerificationFlow;
	passwordChangeSetupTestFlow: PasswordChangeSetupTestFlow;
	passwordChangeExecutionTestFlow: PasswordChangeExecutionTestFlow;
	claimReloadRewardAndVerifyClaimsTestFlow: ClaimReloadRewardAndVerifyClaimsTestFlow;
	verifyReloadRewardPresenceAndClaimsTestFlow: VerifyReloadRewardPresenceAndClaimsTestFlow;
	verifyAndClaimReloadRewardTestFlow: VerifyAndClaimReloadRewardTestFlow;
	verifyReloadUpdateLogicTestFlow: VerifyReloadUpdateLogicTestFlow;
	limboAutobetTestFlow: LimboAutobetTestFlow;
};

type RequiredTestFlowsFixtures = {
	browserSessionManager: BrowserSessionManager;
	gamdomDb: GamdomDb;
	testDataRandom: RandomDataSource;
	testDataObject: ObjectDataSource;
	cryptoAdminPage: CryptoAdminPage;
	homePage: HomePage;
	walletModal: WalletModal;
	transactionsPage: TransactionsPage;
	transactionDetailsModal: TransactionDetailsModal;
	toast: Toast;
	diceGamePage: DiceGamePage;
	userInfoAdminPage: UserInfoAdminPage;
	transactionsAdminPage: UserInfoTransactionsAdminPage;
	userBalanceHandler: UserBalanceHandler;
	gamdomApi: GamdomApi;
	testDataPredefined: PredefinedDataSource;
};

export const testFlowsFixtures = base.extend<
	TestFlowsFixtures & RequiredTestFlowsFixtures
>({
	plinkoBetTestFlow: async ({ browserSessionManager }, use) => {
		await use(
			new PlinkoBetTestFlow(
				new PlinkoUserSetupFlow(browserSessionManager),
				new PlinkoBetExecutionFlow(),
				new PlinkoBalanceVerificationFlow(),
			),
		);
	},
	xpChallengeTestFlow: async ({}, use) => {
		await use(
			new XpChallengeTestFlow(
				new XpChallengeAdminSetupFlow(),
				new XpChallengeActivationFlow(),
				new XpChallengeCompletionFlow(),
			),
		);
	},
	reloadRewardTestFlow: async ({}, use) => {
		await use(
			new ReloadRewardTestFlow(
				new ReloadRewardAdminSetupFlow(),
				new ReloadRewardActivationFlow(),
			),
		);
	},
	promotionTestFlow: async (
		{ gamdomDb, testDataRandom, testDataObject },
		use,
	) => {
		await use(
			new PromotionTestFlow(
				new PromotionSetupFlow(
					gamdomDb,
					testDataRandom,
					testDataObject,
				),
				new PromotionCreationFlow(),
			),
		);
	},
	promotionVisibilityVerificationFlow: async ({}, use) => {
		await use(new PromotionVisibilityVerificationFlow());
	},
	cryptoAdminSetupTestFlow: async (
		{ browserSessionManager, cryptoAdminPage },
		use,
	) => {
		await use(
			new CryptoAdminSetupTestFlow(
				browserSessionManager,
				cryptoAdminPage,
			),
		);
	},
	cryptoFlowDeps: async (
		{
			page,
			browserSessionManager,
			cryptoAdminPage,
			homePage,
			walletModal,
			transactionsPage,
			transactionDetailsModal,
			toast,
			diceGamePage,
			userInfoAdminPage,
			transactionsAdminPage,
			userBalanceHandler,
			gamdomApi,
			gamdomDb,
			testDataPredefined,
		},
		use,
	) => {
		const deps: CryptoFlowDependencies = {
			page: page,
			browserSessionManager: browserSessionManager,
			cryptoAdminPage: cryptoAdminPage,
			homePage: homePage,
			walletModal: walletModal,
			transactionsPage: transactionsPage,
			transactionDetailsModal: transactionDetailsModal,
			toast: toast,
			diceGamePage: diceGamePage,
			userInfoAdminPage: userInfoAdminPage,
			transactionsAdminPage: transactionsAdminPage,
			userBalanceHandler: userBalanceHandler,
			gamdomApi: gamdomApi,
			gamdomDb: gamdomDb,
			testDataPredefined: testDataPredefined,
		};
		await use(deps);
	},
	cryptoDepositTestFlow: async ({ cryptoFlowDeps }, use) => {
		await use(new CryptoDepositTestFlow(cryptoFlowDeps));
	},
	cryptoDepositVerificationTestFlow: async ({ cryptoFlowDeps }, use) => {
		await use(new CryptoDepositVerificationTestFlow(cryptoFlowDeps));
	},
	cryptoWithdrawalSetupTestFlow: async ({ cryptoFlowDeps }, use) => {
		await use(new CryptoWithdrawalSetupTestFlow(cryptoFlowDeps));
	},
	cryptoWithdrawalProcessTestFlow: async ({ cryptoFlowDeps }, use) => {
		await use(new CryptoWithdrawalProcessTestFlow(cryptoFlowDeps));
	},
	cryptoWithdrawalVerificationTestFlow: async ({ cryptoFlowDeps }, use) => {
		await use(new CryptoWithdrawalVerificationTestFlow(cryptoFlowDeps));
	},
	changeReloadRewardTestFlow: async ({}, use) => {
		await use(new ChangeReloadRewardTestFlow());
	},
	claimReloadRewardTestFlow: async ({}, use) => {
		await use(new ClaimReloadRewardTestFlow());
	},
	verifyReloadRewardPresenceTestFlow: async ({}, use) => {
		await use(new VerifyReloadRewardPresenceTestFlow());
	},
	userInfoStaffUserSetupFlow: async ({}, use) => {
		await use(new UserInfoStaffUserSetupFlow());
	},
	userInfoEditFieldFlow: async ({}, use) => {
		await use(new UserInfoEditFieldFlow());
	},
	steamUserLoginLogoutFlow: async ({}, use) => {
		await use(new SteamUserLoginLogoutFlow());
	},
	banUserVerificationFlow: async ({}, use) => {
		await use(new BanUserVerificationFlow());
	},
	passwordChangeSetupTestFlow: async ({}, use) => {
		await use(new PasswordChangeSetupTestFlow());
	},
	passwordChangeExecutionTestFlow: async ({}, use) => {
		await use(new PasswordChangeExecutionTestFlow());
	},
	claimReloadRewardAndVerifyClaimsTestFlow: async ({}, use) => {
		await use(new ClaimReloadRewardAndVerifyClaimsTestFlow());
	},
	verifyReloadRewardPresenceAndClaimsTestFlow: async ({}, use) => {
		await use(new VerifyReloadRewardPresenceAndClaimsTestFlow());
	},
	verifyAndClaimReloadRewardTestFlow: async ({}, use) => {
		await use(new VerifyAndClaimReloadRewardTestFlow());
	},
	verifyReloadUpdateLogicTestFlow: async ({}, use) => {
		await use(new VerifyReloadUpdateLogicTestFlow());
	},
	limboAutobetTestFlow: async ({ browserSessionManager }, use) => {
		await use(
			new LimboAutobetTestFlow(
				new LimboAutobetSetupFlow(browserSessionManager),
				new LimboAutobetExecutionFlow(),
			),
		);
	},
});
