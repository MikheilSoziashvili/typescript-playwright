import {
	BlogVerifySocialShareLinksCsvRecord,
	CasinoGamesAggregatorProviderCsvRecord,
	ChatPinMessagePermissionsCsvRecord,
	FooterLinksAndEndpointsCsvRecord,
	SokGamesMinBetAfterCurrencySwitchCsvRecord,
	OriginalsQuickSelectButtonsCsvRecord,
	OriginalsWalletSwitchingTestsCsvRecord,
	PlinkoBetsAcrossMultipleWalletsCsvRecord,
	PromoCampaignUpdateCsvRecord,
	UserProfileItemsLinksAccessibilityCsvRecord,
	KycLevel2SubmissionsCsvRecord,
	PromotionCombinationForLabelDisplayV4CsvRecord,
	RoyaltyUpLevelRanksCsvRecord,
	RoyaltyUpSkippingLevelsCsvRecord,
	ObtEsportsPagesStatusCodeCsvRecord,
	EnableDisableCryptoCurrenciesStatusesCsvRecord,
	PromotionCombinationsNotForVipCsvRecord,
	ReloadUpdateAfterPartialClaimCsvRecord,
	JackpotContributionCsvRecord,
	ReloadUpdateLogicCsvRecord,
	InstantRewardsRoyaltyUpLevelsCsvRecord,
	CasinoGameInstantRewardsRoyaltyUpLevelsCsvRecord,
} from "@dtos/csv";
import { ChangePasswordCsvRecord } from "@dtos/csv/change-password-csv";
import { OriginalsSelfExclusionCsvRecord } from "@dtos/csv/originals-self-exclusion";
import { PlinkoTestDataCsvRecord } from "@dtos/csv/plinko-test-data-csv";
import { UserInfoSendNotificationCsvRecord } from "@dtos/csv/user-info-send-notification-csv";
import { CsvFilesName } from "@enums/csv-file-name";
import {
	CasinoGamesAggregatorProviderCsvParsedRecord,
	parseCasinoGamesAggregatorProviderCsvRow,
} from "test-data/parsers/casino-games-aggregator-provider-csv-parser";
import {
	BlogVerifySocialShareLinksCsvParsedRecord,
	parseBlogVerifySocialShareLinksCsvRow,
} from "test-data/parsers/blog-verify-social-share-links-csv-parser";
import {
	ChatPinMessagePermissionsCsvParsedRecord,
	parseChatPinMessagePermissionsCsvRow,
} from "test-data/parsers/chat-pin-message-permissions-csv-parser";
import {
	FooterLinksAndEndpointsCsvParsedRecord,
	parseFooterLinksAndEndpointsCsvRow,
} from "test-data/parsers/footer-links-and-redirects-csv-parser";
import {
	OriginalsQuickSelectButtonsCsvParsedRecord,
	parseOriginalsQuickSelectButtonsCsvRow,
} from "test-data/parsers/originals-quick-select-buttons-csv-parser";
import {
	OriginalsSelfExclusionCsvParsedRecord,
	parseOriginalsSelfExclusionCsvRow,
} from "test-data/parsers/originals-self-exclusion-csv-parser";
import {
	OriginalsWalletSwitchingTestsCsvParsedRecord,
	parseOriginalsWalletSwitchingTestsCsvRow,
} from "test-data/parsers/originals-wallet-switching-tests-csv-parser";
import {
	parsePlinkoBetsAcrossMultipleWalletsCsvRow,
	PlinkoBetsAcrossMultipleWalletsCsvParsedRecord,
} from "test-data/parsers/plinko-bets-across-multiple-wallets-csv-parser";
import {
	parsePlinkoTestDataCsvRow,
	PlinkoTestDataCsvParsedRecord,
} from "test-data/parsers/plinko-test-data-csv-parser";
import {
	parsePromoCampaignUpdateCsvRecord,
	PromoCampaignUpdateCsvParsedRecord,
} from "test-data/parsers/promo-campaign-update-csv-parser";
import {
	parseUserInfoSendNotificationCsvRow,
	UserInfoSendNotificationCsvParsedRecord,
} from "test-data/parsers/user-info-send-notification-csv-parser";
import {
	parseUserProfileItemsLinksAccessibilityCsvRow,
	UserProfileItemsLinksAccessibilityCsvParsedRecord,
} from "test-data/parsers/user-profile-items-links-accessibility-csv-parser";
import {
	parseKycLevel2SubmissionsCsvRow,
	KycLevel2SubmissionsCsvParsedRecord,
} from "test-data/parsers/kyc-level2-submissions-csv-parser";
import {
	parsePromotionCombinationLabelUpdateCsvRow,
	PromotionCombinationForLabelDisplayV4CsvParsedRecord,
} from "test-data/parsers/promotion-combinations-for-label-display-csv-parser";
import {
	parseRoyaltyUpLevelRanksCsvRow,
	RoyaltyUpLevelRanksCsvParsedRecord,
} from "test-data/parsers/royalty-up-level-ranks-csv-parser";
import {
	parseRoyaltyUpSkippingLevelsCsvRow,
	RoyaltyUpSkippingLevelsCsvParsedRecord,
} from "test-data/parsers/royalty-up-skipping-levels-csv-parser";
import {
	parseObtEsportsPagesStatusCodeCsvRow,
	ObtEsportsPagesStatusCodeCsvParsedRecord,
} from "test-data/parsers/obt-esports-pages-status-code-csv-parser";
import {
	parseEnableDisableCryptoCurrenciesStatusesCsvRow,
	EnableDisableCryptoCurrenciesStatusesCsvParsedRecord,
} from "test-data/parsers/enable-disable-crypto-currencies-statuses-csv-parser";
import {
	parsePromotionCombinationsNotForVipCsvRow,
	PromotionCombinationsNotForVipCsvParsedRecord,
} from "test-data/parsers/promotion-combinations-not-for-vip-csv-parser";
import {
	parseReloadUpdateAfterPartialClaimCsvRow,
	ReloadUpdateAfterPartialClaimCsvParsedRecord,
} from "test-data/parsers/reload-update-after-partial-claim-csv-parser";
import {
	parseJackpotContributionCsvRow,
	JackpotContributionCsvParsedRecord,
} from "test-data/parsers/jackpot-contribution-csv-parser";
import {
	parseReloadUpdateLogicCsvRow,
	ReloadUpdateLogicCsvParsedRecord,
} from "test-data/parsers/reload-update-logic-csv-parser";
import {
	parseChangePasswordCsvRow,
	ChangePasswordCsvParsedRecord,
} from "test-data/parsers/change-password-csv-parser";
import {
	parseSokGamesMinBetAfterCurrencySwitchCsvRow,
	SokGamesMinBetAfterCurrencySwitchCsvParsedRecord,
} from "test-data/parsers/sok-games-min-bet-after-currency-switch-csv-parser";
import {
	parseInstantRewardsRoyaltyUpLevelsCsvRow,
	InstantRewardsRoyaltyUpLevelsCsvParsedRecord,
} from "test-data/parsers/instant-rewards-royalty-up-levels-csv-parser";
import {
	parseCasinoGameInstantRewardsRoyaltyUpLevelsCsvRow,
	CasinoGameInstantRewardsRoyaltyUpLevelsCsvParsedRecord,
} from "test-data/parsers/casino-game-instant-rewards-royalty-up-levels-csv-parser";

export type CsvTransformerExistingType<T> =
	T extends keyof CsvTransformerMapType ? CsvTransformerMapType[T] : never;

export type CsvTransformerExistingReturnType<
	T extends keyof CsvTransformerMapType,
> = ReturnType<CsvTransformerMapType[T]>[];

export type CsvTransformerExisting<T> = T extends keyof CsvTransformerMapType
	? T
	: never;

export type CsvRowType<T extends keyof CsvTransformerMapType> = Parameters<
	CsvTransformerMapType[T]
>[0];

export type CsvTransformerFunctionType<T extends keyof CsvTransformerMapType> =
	(row: CsvRowType<T>) => CsvTransformerExistingReturnType<T>;

export type CsvTransformerMapType = {
	[CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER]: (
		row: CasinoGamesAggregatorProviderCsvRecord,
	) => CasinoGamesAggregatorProviderCsvParsedRecord;

	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: (
		row: OriginalsQuickSelectButtonsCsvRecord,
	) => OriginalsQuickSelectButtonsCsvParsedRecord;

	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]: (
		row: UserInfoSendNotificationCsvRecord,
	) => UserInfoSendNotificationCsvParsedRecord;

	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]: (
		row: UserProfileItemsLinksAccessibilityCsvRecord,
	) => UserProfileItemsLinksAccessibilityCsvParsedRecord;

	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]: (
		row: PlinkoBetsAcrossMultipleWalletsCsvRecord,
	) => PlinkoBetsAcrossMultipleWalletsCsvParsedRecord;

	[CsvFilesName.ORIGINALS_WALLET_SWITCHING_TESTS]: (
		row: OriginalsWalletSwitchingTestsCsvRecord,
	) => OriginalsWalletSwitchingTestsCsvParsedRecord;

	[CsvFilesName.PLINKO_TEST_DATA]: (
		row: PlinkoTestDataCsvRecord,
	) => PlinkoTestDataCsvParsedRecord;

	[CsvFilesName.ORIGINALS_SELF_EXCLUSION]: (
		row: OriginalsSelfExclusionCsvRecord,
	) => OriginalsSelfExclusionCsvParsedRecord;

	[CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS]: (
		row: FooterLinksAndEndpointsCsvRecord,
	) => FooterLinksAndEndpointsCsvParsedRecord;

	[CsvFilesName.CHAT_PIN_UNPIN]: (
		row: ChatPinMessagePermissionsCsvRecord,
	) => ChatPinMessagePermissionsCsvParsedRecord;

	[CsvFilesName.BLOG_VERIFY_SOCIAL_SHARE_LINKS]: (
		row: BlogVerifySocialShareLinksCsvRecord,
	) => BlogVerifySocialShareLinksCsvParsedRecord;

	[CsvFilesName.PROMO_CAMPAIGN_UPDATE]: (
		row: PromoCampaignUpdateCsvRecord,
	) => PromoCampaignUpdateCsvParsedRecord;

	[CsvFilesName.KYC_LEVEL2_SUBMISSIONS]: (
		row: KycLevel2SubmissionsCsvRecord,
	) => KycLevel2SubmissionsCsvParsedRecord;

	[CsvFilesName.PROMOTION_COMBINATIONS_FOR_LABEL_DISPLAY_V4]: (
		row: PromotionCombinationForLabelDisplayV4CsvRecord,
	) => PromotionCombinationForLabelDisplayV4CsvParsedRecord;

	[CsvFilesName.ROYALTY_UP_LEVEL_RANKS]: (
		row: RoyaltyUpLevelRanksCsvRecord,
	) => RoyaltyUpLevelRanksCsvParsedRecord;

	[CsvFilesName.ROYALTY_UP_SKIPPING_LEVELS]: (
		row: RoyaltyUpSkippingLevelsCsvRecord,
	) => RoyaltyUpSkippingLevelsCsvParsedRecord;

	[CsvFilesName.OBT_ESPORTS_PAGES_STATUS_CODE]: (
		row: ObtEsportsPagesStatusCodeCsvRecord,
	) => ObtEsportsPagesStatusCodeCsvParsedRecord;

	[CsvFilesName.ENABLE_DISABLE_CRYPTO_CURRENCIES_STATUSES]: (
		row: EnableDisableCryptoCurrenciesStatusesCsvRecord,
	) => EnableDisableCryptoCurrenciesStatusesCsvParsedRecord;

	[CsvFilesName.PROMOTION_COMBINATIONS_NOT_FOR_VIP]: (
		row: PromotionCombinationsNotForVipCsvRecord,
	) => PromotionCombinationsNotForVipCsvParsedRecord;

	[CsvFilesName.RELOAD_UPDATE_AFTER_PARTIAL_CLAIM]: (
		row: ReloadUpdateAfterPartialClaimCsvRecord,
	) => ReloadUpdateAfterPartialClaimCsvParsedRecord;
	[CsvFilesName.JACKPOT_CONTRIBUTION]: (
		row: JackpotContributionCsvRecord,
	) => JackpotContributionCsvParsedRecord;

	[CsvFilesName.RELOAD_UPDATE_LOGIC]: (
		row: ReloadUpdateLogicCsvRecord,
	) => ReloadUpdateLogicCsvParsedRecord;

	[CsvFilesName.CHANGE_PASSWORD]: (
		row: ChangePasswordCsvRecord,
	) => ChangePasswordCsvParsedRecord;

	[CsvFilesName.SOK_GAMES_MIN_BET_AFTER_CURRENCY_SWITCH]: (
		row: SokGamesMinBetAfterCurrencySwitchCsvRecord,
	) => SokGamesMinBetAfterCurrencySwitchCsvParsedRecord;

	[CsvFilesName.INSTANT_REWARDS_ROYALTY_UP_LEVELS]: (
		row: InstantRewardsRoyaltyUpLevelsCsvRecord,
	) => InstantRewardsRoyaltyUpLevelsCsvParsedRecord;

	[CsvFilesName.CASINO_GAME_INSTANT_REWARDS_ROYALTY_UP_LEVELS]: (
		row: CasinoGameInstantRewardsRoyaltyUpLevelsCsvRecord,
	) => CasinoGameInstantRewardsRoyaltyUpLevelsCsvParsedRecord;
};

export const CsvTransformerMap: CsvTransformerMapType = {
	[CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER]:
		parseCasinoGamesAggregatorProviderCsvRow,
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]:
		parseOriginalsQuickSelectButtonsCsvRow,
	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]:
		parseUserInfoSendNotificationCsvRow,
	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]:
		parseUserProfileItemsLinksAccessibilityCsvRow,
	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]:
		parsePlinkoBetsAcrossMultipleWalletsCsvRow,
	[CsvFilesName.ORIGINALS_WALLET_SWITCHING_TESTS]:
		parseOriginalsWalletSwitchingTestsCsvRow,
	[CsvFilesName.PLINKO_TEST_DATA]: parsePlinkoTestDataCsvRow,
	[CsvFilesName.ORIGINALS_SELF_EXCLUSION]: parseOriginalsSelfExclusionCsvRow,
	[CsvFilesName.FOOTER_LINKS_AND_ENDPOINTS]:
		parseFooterLinksAndEndpointsCsvRow,
	[CsvFilesName.CHAT_PIN_UNPIN]: parseChatPinMessagePermissionsCsvRow,
	[CsvFilesName.BLOG_VERIFY_SOCIAL_SHARE_LINKS]:
		parseBlogVerifySocialShareLinksCsvRow,
	[CsvFilesName.PROMO_CAMPAIGN_UPDATE]: parsePromoCampaignUpdateCsvRecord,
	[CsvFilesName.KYC_LEVEL2_SUBMISSIONS]: parseKycLevel2SubmissionsCsvRow,
	[CsvFilesName.PROMOTION_COMBINATIONS_FOR_LABEL_DISPLAY_V4]:
		parsePromotionCombinationLabelUpdateCsvRow,
	[CsvFilesName.ROYALTY_UP_LEVEL_RANKS]: parseRoyaltyUpLevelRanksCsvRow,
	[CsvFilesName.ROYALTY_UP_SKIPPING_LEVELS]:
		parseRoyaltyUpSkippingLevelsCsvRow,
	[CsvFilesName.OBT_ESPORTS_PAGES_STATUS_CODE]:
		parseObtEsportsPagesStatusCodeCsvRow,
	[CsvFilesName.ENABLE_DISABLE_CRYPTO_CURRENCIES_STATUSES]:
		parseEnableDisableCryptoCurrenciesStatusesCsvRow,
	[CsvFilesName.PROMOTION_COMBINATIONS_NOT_FOR_VIP]:
		parsePromotionCombinationsNotForVipCsvRow,
	[CsvFilesName.RELOAD_UPDATE_AFTER_PARTIAL_CLAIM]:
		parseReloadUpdateAfterPartialClaimCsvRow,
	[CsvFilesName.JACKPOT_CONTRIBUTION]: parseJackpotContributionCsvRow,
	[CsvFilesName.RELOAD_UPDATE_LOGIC]: parseReloadUpdateLogicCsvRow,
	[CsvFilesName.CHANGE_PASSWORD]: parseChangePasswordCsvRow,
	[CsvFilesName.SOK_GAMES_MIN_BET_AFTER_CURRENCY_SWITCH]:
		parseSokGamesMinBetAfterCurrencySwitchCsvRow,
	[CsvFilesName.INSTANT_REWARDS_ROYALTY_UP_LEVELS]:
		parseInstantRewardsRoyaltyUpLevelsCsvRow,
	[CsvFilesName.CASINO_GAME_INSTANT_REWARDS_ROYALTY_UP_LEVELS]:
		parseCasinoGameInstantRewardsRoyaltyUpLevelsCsvRow,
} as const;
