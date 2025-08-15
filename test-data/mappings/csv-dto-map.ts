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
} from "@dtos/csv";
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
};
