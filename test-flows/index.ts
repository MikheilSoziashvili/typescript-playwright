export { BaseTestFlow } from "./base/base-test-flow";
export { testFlow } from "../decorators/test-flow";

export { FeatureActivationV4TestFlow } from "./feature-activation/feature-activation-v4-test-flow";

export { PromotionSetupFlow } from "./promotions/promotion-setup-test-flow";
export { PromotionCreationFlow } from "./promotions/promotion-creation-test-flow";
export { PromotionVisibilityVerificationFlow } from "./promotions/promotion-visibility-verification-test-flow";
export { PromotionTestFlow } from "./promotions/promotion-test-flow";

// Crypto flows - deposit
export { CryptoAdminSetupTestFlow } from "./crypto/crypto-admin-setup-test-flow";
export { CryptoDepositTestFlow } from "./crypto/crypto-deposit-test-flow";
export { CryptoDepositVerificationTestFlow } from "./crypto/crypto-deposit-verification-test-flow";

// Crypto flows - withdrawal
export { CryptoWithdrawalSetupTestFlow } from "./crypto/crypto-withdrawal-setup-test-flow";
export { CryptoWithdrawalProcessTestFlow } from "./crypto/crypto-withdrawal-process-test-flow";
export { CryptoWithdrawalVerificationTestFlow } from "./crypto/crypto-withdrawal-verification-test-flow";
export { StreamerWithdrawalReviewTestFlow } from "./crypto/streamer-withdrawal-review-test-flow";

// Crypto types
export type {
	CryptoClient,
	CryptoConfig,
	CryptoFlowDependencies,
	DepositProcessResult,
	WithdrawalSetupResult,
	WithdrawalProcessResult,
	WithdrawalUserVerificationResult,
} from "./crypto/types/crypto-flow-types";
export {
	ETH_CONFIG,
	BNB_CONFIG,
	TRX_CONFIG,
	BTC_CONFIG,
	LTC_CONFIG,
	XRP_CONFIG,
	SOL_CONFIG,
	USDC_ETH_CONFIG,
	USDC_SOL_CONFIG,
	USDC_BSC_CONFIG,
	USDT_ETH_CONFIG,
	USDT_TRX_CONFIG,
	USDT_BSC_CONFIG,
	USD1_SOL_CONFIG,
	USD1_ETH_CONFIG,
} from "./crypto/types/crypto-flow-types";

// Crypto client adapters
export { toFireblocksCryptoClient } from "./crypto/adapters/fireblocks-crypto-client-adapter";
export { toUtxoCryptoClient } from "./crypto/adapters/utxo-crypto-client-adapter";
export { toXrpCryptoClient } from "./crypto/adapters/xrp-crypto-client-adapter";

// Limbo flows
export { LimboAutobetSetupFlow } from "./originals/limbo/limbo-autobet-setup-test-flow";
export { LimboAutobetExecutionFlow } from "./originals/limbo/limbo-autobet-execution-test-flow";
export { LimboAutobetTestFlow } from "./originals/limbo/limbo-autobet-test-flow";

// User Info flows
export { UserInfoStaffUserSetupFlow } from "./user-info/user-info-staff-user-setup-test-flow";
export { UserInfoEditFieldFlow } from "./user-info/user-info-edit-field-test-flow";

// Ban flows
export { SteamUserLoginLogoutFlow } from "./ban/steam-user-login-logout-test-flow";
export { BanUserVerificationFlow } from "./ban/ban-user-verification-test-flow";
export { HardBanResponsibleGamblingTestFlow } from "./ban/hard-ban-responsible-gambling-test-flow";
export { HardBanSupportRequestedTestFlow } from "./ban/hard-ban-support-requested-test-flow";

// Ban types
export type {
	BanUserVerificationParams,
	SteamUserLoginLogoutParams,
} from "./ban/types/ban-flow-types";
export type { HardBanResponsibleGamblingParams } from "./ban/types/hard-ban-flow-types";
// Originals flows - shared
export { OriginalsBetPlacementTestFlow } from "./originals/originals-bet-placement-test-flow";

// KoTH flows
export { KothPointsCalculationTestFlow } from "./koth/koth-points-calculation-test-flow";

// Password flows
export { PasswordChangeSetupTestFlow } from "./password/password-change-setup-test-flow";
export { PasswordChangeExecutionTestFlow } from "./password/password-change-execution-test-flow";
export { PasswordChangeSetupResult } from "./password/password-change-setup-test-flow";

// EV Rewards flows
export { EvRewardsBulkRewardSetupTestFlow } from "./rewards/ev-rewards-bulk-reward-setup-test-flow";
export { EvRewardsClaimRewardVerificationTestFlow } from "./rewards/ev-rewards-claim-reward-verification-test-flow";
export { EvRewardsBulkRewardScenarioTestFlow } from "./rewards/ev-rewards-bulk-reward-scenario-test-flow";

// Instant rakeback reward flows
export { InstantRakebackRewardTestFlow } from "./rewards/instant-rakeback-reward-test-flow";
export { CasinoGameHouseEdgeTestFlow } from "./rewards/casino-game-house-edge-test-flow";
export { CasinoGameRakebackTestFlow } from "./rewards/casino-game-rakeback-test-flow";

// Custom reward history flows
export { CustomRewardHappyPathTestFlow } from "./rewards/custom-reward-happy-path-test-flow";
export { CustomRewardCancelTestFlow } from "./rewards/custom-reward-cancel-test-flow";
export { CustomRewardKycTestFlow } from "./rewards/custom-reward-kyc-test-flow";
export { PromoRewardHistoryTestFlow } from "./rewards/promo-reward-history-test-flow";
export { TipRewardHistoryTestFlow } from "./rewards/tip-reward-history-test-flow";
export { WeeklyMonthlyRewardTestFlow } from "./rewards/weekly-monthly-reward-test-flow";
