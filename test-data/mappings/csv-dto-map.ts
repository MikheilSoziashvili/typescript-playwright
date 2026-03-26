import {
	BlogVerifySocialShareLinksCsv,
	CrashAutoCashoutCsv,
	CrashIncreaseBysCsv,
	DiceAutobetCsv,
	CasinoGamesAggregatorProviderCsv,
	ChatDiamondIconForVipUsersCsv,
	ChatPinMessagePermissionsCsv,
	ChatroomsSuccessfullySelectedCsv,
	EditInfoAdjustingWalletsCsv,
	EnableDisableCryptoCurrenciesStatusesCsv,
	EsportsCategoriesCsv,
	EvRewardFreeSpinsPromotionCsv,
	FooterLinksAndEndpointsCsv,
	KothCurrenciesSymbolsCsv,
	KycLevel2SubmissionsCsv,
	KycUsersLevelVerificationPageCsv,
	LoginInputValidationCsv,
	LoginRejectedCsv,
	LoginSuccessfulCsv,
	ObtEsportsPagesStatusCodeCsv,
	OriginalsLaunchFromHomepageCsv,
	OriginalsQuickSelectButtonsCsv,
	OriginalsWalletSwitchingTestsCsv,
	PlinkoBetsAcrossMultipleWalletsCsv,
	PromoCampaignUpdateCsv,
	PromoCodeFailedRedemptionCsv,
	PromotionCombinationForLabelDisplayCsv,
	RoyaltyUpLevelRanksCsv,
	RoyaltyUpSkippingLevelsCsv,
	UserProfileItemsLinksAccessibilityCsv,
	PromotionCombinationsNotForVipCsv,
	UnwageredDepositsFieldCsv,
	ChangePasswordCsv,
	ReloadUpdateAfterPartialClaimCsv,
	JackpotContributionCsv,
	ReloadUpdateLogicCsv,
	LimboManualModeCsv,
	LimboAutoModeCsv,
	HardBanResponsibleGamblingCsv,
	HardBanReasonsWithImmediateAccountLockCsv,
	SendWeeklyMonthlyRewardCsv,
	InstantRewardsRoyaltyUpLevelsCsv,
	CasinoGameInstantRewardsRoyaltyUpLevelsCsv,
} from "@dtos/csv";
import { HomePageBannerCarouselCsv } from "@dtos/csv/home-page-banner-carousel-csv";
import { SokGamesMinBetAfterCurrencySwitchCsv } from "@dtos/csv/sok-games-min-bet-after-currency-switch-csv";
import { KothPointsCalculationCsv } from "@dtos/csv/koth-points-calculation-csv";
import { OriginalsSelfExclusionCsv } from "@dtos/csv/originals-self-exclusion";
import { PlinkoTestDataCsv } from "@dtos/csv/plinko-test-data-csv";
import { PossibleWinPopUpCsv } from "@dtos/csv/possible-win-pop-up-csv";
import { UserInfoSendNotificationCsv } from "@dtos/csv/user-info-send-notification-csv";
import { PhoneNumberValidationCsv } from "@dtos/csv/phone-number-validation-csv";
import { CsvFilesName } from "@enums/csv-file-name";

export type CsvDtoMap = {
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: OriginalsQuickSelectButtonsCsv;
	[CsvFilesName.HOMEPAGE_ORIGINALS_LAUNCH]: OriginalsLaunchFromHomepageCsv;
	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]: UserInfoSendNotificationCsv;
	[CsvFilesName.KOTH_CURRENCIES_SYMBOLS]: KothCurrenciesSymbolsCsv;
	[CsvFilesName.KYC_USERS_LEVEL_VERIFICATION_PAGE]: KycUsersLevelVerificationPageCsv;
	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]: UserProfileItemsLinksAccessibilityCsv;
	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]: PlinkoBetsAcrossMultipleWalletsCsv;
	[CsvFilesName.ORIGINALS_WALLET_SWITCHING_TESTS]: OriginalsWalletSwitchingTestsCsv;
	[CsvFilesName.CHATROOM_SUCCESSFULLY_SELECTED]: ChatroomsSuccessfullySelectedCsv;
	[CsvFilesName.EDIT_INFO_ADJUSTING_WALLETS]: EditInfoAdjustingWalletsCsv;
	[CsvFilesName.PROMO_CODE_FAILED_REDEMPTION]: PromoCodeFailedRedemptionCsv;
	[CsvFilesName.PLINKO_TEST_DATA]: PlinkoTestDataCsv;
	[CsvFilesName.VIP_USER_STATUS]: ChatDiamondIconForVipUsersCsv;
	[CsvFilesName.ORIGINALS_SELF_EXCLUSION]: OriginalsSelfExclusionCsv;
	[CsvFilesName.EV_REWARD_FREE_SPINS_PROMOTION]: EvRewardFreeSpinsPromotionCsv;
	[CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS]: FooterLinksAndEndpointsCsv;
	[CsvFilesName.LOGIN_SUCCESSFUL]: LoginSuccessfulCsv;
	[CsvFilesName.HOME_PAGE_BANNER_CAROUSEL]: HomePageBannerCarouselCsv;
	[CsvFilesName.CHAT_PIN_UNPIN]: ChatPinMessagePermissionsCsv;
	[CsvFilesName.BLOG_VERIFY_SOCIAL_SHARE_LINKS]: BlogVerifySocialShareLinksCsv;
	[CsvFilesName.PROMO_CAMPAIGN_UPDATE]: PromoCampaignUpdateCsv;
	[CsvFilesName.POSSIBLE_WIN_POP_UP]: PossibleWinPopUpCsv;
	[CsvFilesName.KYC_LEVEL2_SUBMISSIONS]: KycLevel2SubmissionsCsv;
	[CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER]: CasinoGamesAggregatorProviderCsv;
	[CsvFilesName.ESPORTS_CATEGORIES]: EsportsCategoriesCsv;
	[CsvFilesName.LOGIN_INPUT_VALIDATION]: LoginInputValidationCsv;
	[CsvFilesName.LOGIN_REJECTED]: LoginRejectedCsv;
	[CsvFilesName.PROMOTION_COMBINATIONS_FOR_LABEL_DISPLAY]: PromotionCombinationForLabelDisplayCsv;
	[CsvFilesName.ROYALTY_UP_LEVEL_RANKS]: RoyaltyUpLevelRanksCsv;
	[CsvFilesName.ROYALTY_UP_SKIPPING_LEVELS]: RoyaltyUpSkippingLevelsCsv;
	[CsvFilesName.OBT_ESPORTS_PAGES_STATUS_CODE]: ObtEsportsPagesStatusCodeCsv;
	[CsvFilesName.ENABLE_DISABLE_CRYPTO_CURRENCIES_STATUSES]: EnableDisableCryptoCurrenciesStatusesCsv;
	[CsvFilesName.PROMOTION_COMBINATIONS_NOT_FOR_VIP]: PromotionCombinationsNotForVipCsv;
	[CsvFilesName.UNWAGERED_DEPOSITS_FIELD]: UnwageredDepositsFieldCsv;
	[CsvFilesName.CHANGE_PASSWORD]: ChangePasswordCsv;
	[CsvFilesName.CHANGE_PASSWORD_2FA]: ChangePasswordCsv;
	[CsvFilesName.RELOAD_UPDATE_AFTER_PARTIAL_CLAIM]: ReloadUpdateAfterPartialClaimCsv;
	[CsvFilesName.JACKPOT_CONTRIBUTION]: JackpotContributionCsv;
	[CsvFilesName.RELOAD_UPDATE_LOGIC]: ReloadUpdateLogicCsv;
	[CsvFilesName.LIMBO_MANUAL_MODE]: LimboManualModeCsv;
	[CsvFilesName.LIMBO_AUTO_MODE]: LimboAutoModeCsv;
	[CsvFilesName.HARD_BAN_RESPONSIBLE_GAMBLING]: HardBanResponsibleGamblingCsv;
	[CsvFilesName.SOK_GAMES_MIN_BET_AFTER_CURRENCY_SWITCH]: SokGamesMinBetAfterCurrencySwitchCsv;
	[CsvFilesName.HARD_BAN_REASONS_WITH_IMMEDIATE_ACCOUNT_LOCK]: HardBanReasonsWithImmediateAccountLockCsv;
	[CsvFilesName.SEND_WEEKLY_MONTHLY_REWARD]: SendWeeklyMonthlyRewardCsv;
	[CsvFilesName.INSTANT_REWARDS_ROYALTY_UP_LEVELS]: InstantRewardsRoyaltyUpLevelsCsv;
	[CsvFilesName.CASINO_GAME_INSTANT_REWARDS_ROYALTY_UP_LEVELS]: CasinoGameInstantRewardsRoyaltyUpLevelsCsv;
	[CsvFilesName.KOTH_POINTS_CALCULATION]: KothPointsCalculationCsv;
	[CsvFilesName.DICE_AUTOBET]: DiceAutobetCsv;
	[CsvFilesName.CRASH_AUTO_CASHOUT]: CrashAutoCashoutCsv;
	[CsvFilesName.CRASH_INCREASE_BY]: CrashIncreaseBysCsv;
	[CsvFilesName.PHONE_NUMBER_VALIDATION]: PhoneNumberValidationCsv;
};
