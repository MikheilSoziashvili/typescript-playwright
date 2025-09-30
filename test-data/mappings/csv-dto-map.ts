import {
	LoginNotPossibleCsv,
	OriginalsLaunchFromHomepageCsv,
	OriginalsQuickSelectButtonsCsv,
	HomepageTopLineHeaderLinksCsv,
	KothCurrenciesSymbolsCsv,
	KycUsersLevelVerificationPageCsv,
	UserProfileItemsLinksAccessibilityCsv,
	PlinkoBetsAcrossMultipleWalletsCsv,
	ChatroomsSuccessfullySelectedCsv,
	EditInfoAdjustingWalletsCsv,
	PromoCodeFailedRedemptionCsv,
	ChatDiamondIconForVipUsersCsv,
	EvRewardFreeSpinsPromotionCsv,
	FooterLinksAndEndpointsCsv,
	LoginSuccessfulCsv,
	ChatPinMessagePermissionsCsv,
} from "@dtos/csv";
import { HomePageBannerCarouselCsv } from "@dtos/csv/home-page-banner-carousel-csv";
import { OriginalsSelfExclusionCsv } from "@dtos/csv/originals-self-exclusion";
import { PlinkoTestDataCsv } from "@dtos/csv/plinko-test-data-csv";
import { UserInfoSendNotificationCsv } from "@dtos/csv/user-info-send-notification-csv";
import { CsvFilesName } from "@enums/csv-file-name";

export type CsvDtoMap = {
	[CsvFilesName.LOGIN_NOT_POSSIBLE]: LoginNotPossibleCsv;
	[CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS]: OriginalsQuickSelectButtonsCsv;
	[CsvFilesName.HOMEPAGE_ORIGINALS_LAUNCH]: OriginalsLaunchFromHomepageCsv;
	[CsvFilesName.HOMEPAGE_TOP_LINE_HEADER_LINKS]: HomepageTopLineHeaderLinksCsv;
	[CsvFilesName.USER_INFO_SEND_NOTIFICATION]: UserInfoSendNotificationCsv;
	[CsvFilesName.KOTH_CURRENCIES_SYMBOLS]: KothCurrenciesSymbolsCsv;
	[CsvFilesName.KYC_USERS_LEVEL_VERIFICATION_PAGE]: KycUsersLevelVerificationPageCsv;
	[CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY]: UserProfileItemsLinksAccessibilityCsv;
	[CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS]: PlinkoBetsAcrossMultipleWalletsCsv;
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
};
