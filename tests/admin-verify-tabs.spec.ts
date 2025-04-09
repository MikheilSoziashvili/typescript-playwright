import { test } from "@fixtures/fixtures";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "../enums/csv-file-name";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { Locator } from "playwright";
import { AdminTabLocatorKey } from "@enums/admin-tab-locator-keys";

test.describe.parallel("Admin page tabs visibility tests", () => {
	test.slow();
	test.use(
		storageStateUserAPI(
			SUPER_ADMIN_CREDENTIALS.username,
			SUPER_ADMIN_CREDENTIALS.password,
		),
	);

	for (const record of parse_csv(DATASETS_DIR, CsvFilesName.ADMIN_TABS) as {
		adminTab: string;
		adminTabLocator: string;
		adminTabEndpoint: string;
	}[]) {
		test(`[ENG-3349] [Admin] Verify admin tabs, tab: ${record.adminTab}`, async ({
			baseAdminPage,
			userInfoAdminPage,
			vipManagerAdminPage,
			freeSpinsAdminPage,
			marketingAdminPage,
			featuresAdminPage,
			testingAdminPage,
			kothAdminPage,
			botsAdminPage,
			writerAdminPage,
			cryptoAdminPage,
			jackpotAdminPage,
			kycAdminPage,
			actionsAdminPage,
			priceWatchAdminPage,
			systemAdminPage,
			rainAdminPage,
			securityAdminPage,
			ipBlockAdminPage,
			paymentsAdminPage,
			newUsersAdminPage,
			modTipAdminPage,
			communityConnectAdminPage,
			casinoProvidersAdminPage,
			casinoGamesAdminPage,
			ourGamesAdminPage,
			plainSqlAdminPage,
			statsAdminPage,
			battlesAdminPage,
			cdnUploadAdminPage,
			eventsManagingAdminPage,
			dynamicDomainsAdminPage,
			evRewardsSystemAdminPage,
			openTradesAdminPage,
			affiliatesAdminPage,
		}) => {
			const locatorMap: Record<string, Locator> = {
				[AdminTabLocatorKey.UserInfo]:
					userInfoAdminPage.map.viewUserInfoBox,
				[AdminTabLocatorKey.VipManager]:
					vipManagerAdminPage.map.vipManagerPageContent,
				[AdminTabLocatorKey.FreeSpins]:
					freeSpinsAdminPage.map.findGameToGiveFreeSpinsCard,
				[AdminTabLocatorKey.Marketing]:
					marketingAdminPage.map.marketingPanelTitle,
				[AdminTabLocatorKey.Features]:
					featuresAdminPage.map.featuresSettingsTitle,
				[AdminTabLocatorKey.Testing]:
					testingAdminPage.map.mockDateButton,
				[AdminTabLocatorKey.Koth]:
					kothAdminPage.map.kothAdminPanelTitle,
				[AdminTabLocatorKey.Bots]: botsAdminPage.map.tradebotsHeader,
				[AdminTabLocatorKey.Writer]:
					writerAdminPage.map.titleInformationHeader,
				[AdminTabLocatorKey.Crypto]:
					cryptoAdminPage.map.sendQueuedWithdrawalsButton,
				[AdminTabLocatorKey.Jackpot]:
					jackpotAdminPage.map.viewJackpotRoundsHeader,
				[AdminTabLocatorKey.Kyc]: kycAdminPage.map.searchByUserIdInput,
				[AdminTabLocatorKey.Actions]:
					actionsAdminPage.map.broadcastMessageTitle,
				[AdminTabLocatorKey.PriceWatch]:
					priceWatchAdminPage.map.updatePricesFromSourcesLink,
				[AdminTabLocatorKey.System]:
					systemAdminPage.map.systemActionsHeader,
				[AdminTabLocatorKey.ReduceSystem]:
					rainAdminPage.map.makeItRainTitle,
				[AdminTabLocatorKey.Security]:
					securityAdminPage.map.withdrawSettingsHeader,
				[AdminTabLocatorKey.IpBlock]:
					ipBlockAdminPage.map.blockNewIpAddressButton,
				[AdminTabLocatorKey.Payments]:
					paymentsAdminPage.map.settingsButton,
				[AdminTabLocatorKey.NewUsers]:
					newUsersAdminPage.map.fetchNewUsersSettingsHeader,
				[AdminTabLocatorKey.ModTip]:
					modTipAdminPage.map.sendModTipNowTitle,
				[AdminTabLocatorKey.CommunityConnect]:
					communityConnectAdminPage.map.changeFsCurrencyTitle,
				[AdminTabLocatorKey.CasinoProviders]:
					casinoProvidersAdminPage.map.searchByProviderNameInput,
				[AdminTabLocatorKey.CasinoGames]:
					casinoGamesAdminPage.map.downloadGamesCsvButton,
				[AdminTabLocatorKey.OurGames]:
					ourGamesAdminPage.map.saveAndUploadConfigButton,
				[AdminTabLocatorKey.PlainSql]:
					plainSqlAdminPage.map.queryButton,
				[AdminTabLocatorKey.Stats]:
					statsAdminPage.map.currentKingOfTheHillEventsHeader,
				[AdminTabLocatorKey.Battles]:
					battlesAdminPage.map.viewDetailButton,
				[AdminTabLocatorKey.CdnUpload]:
					cdnUploadAdminPage.map.cdnUploaderHeader,
				[AdminTabLocatorKey.EventsManaging]:
					eventsManagingAdminPage.map.logoHeader,
				[AdminTabLocatorKey.DynamicDomains]:
					dynamicDomainsAdminPage.map.currentDomainsHeader,
				[AdminTabLocatorKey.EvRewardsSystem]:
					evRewardsSystemAdminPage.map.bulkRewardsUploadButton,
				[AdminTabLocatorKey.OpenTrades]:
					openTradesAdminPage.map.unsentTradeHistoryHeader,
				[AdminTabLocatorKey.Affiliates]:
					affiliatesAdminPage.map.searchCodeLabel,
			};

			await baseAdminPage
				.steps()
				.navigateAndAssertTab(
					baseAdminPage,
					record.adminTab,
					record.adminTabEndpoint,
				);

			await baseAdminPage
				.assertThat()
				.checkElementsAreVisible([locatorMap[record.adminTabLocator]]);
		});
	}
});
