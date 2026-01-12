import {
	BlogVerifySocialShareLinksCsvRecord,
	CasinoGamesAggregatorProviderCsvRecord,
	ChatPinMessagePermissionsCsvRecord,
	FooterLinksAndEndpointsCsvRecord,
	OriginalsQuickSelectButtonsCsvRecord,
	OriginalsWalletSwitchingTestsCsvRecord,
	PlinkoBetsAcrossMultipleWalletsCsvRecord,
	PromoCampaignUpdateCsvRecord,
	UserProfileItemsLinksAccessibilityCsvRecord,
	KycLevel2SubmissionsCsvRecord,
	PromotionCombinationForLabelDisplayV4CsvRecord,
	RoyaltyUpLevelRanksCsvRecord,
} from "@dtos/csv";
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
} as const;
