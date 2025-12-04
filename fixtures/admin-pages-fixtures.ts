import { ActionsAdminPage } from "@pages/admin/actions-admin/actions-admin-page";
import { AffiliatesAdminPage } from "@pages/admin/affiliates-admin/affiliates-admin-page";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { UserInfoInfoAdminPage } from "@pages/admin/user-info-admin/user-info-info-admin/user-info-info-admin-page";
import { SecurityAdminPage } from "@pages/admin/security-admin/security-admin-page";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { VipManagerAdminPage } from "@pages/admin/vip-manager/vip-manager-page";
import { WriterAdminPage } from "@pages/admin/writer-admin/writer-admin-page";
import { WriterAdminNewPage } from "@pages/admin/writer-admin-new/writer-admin-new-page";
import { MarketingAdminPage } from "@pages/admin/marketing-admin/marketing-admin-page";
import { FeaturesAdminPage } from "@pages/admin/features-admin/features-admin-page";
import { TestingAdminPage } from "@pages/admin/testing-admin/testing-admin-page";
import { KothAdminPage } from "@pages/admin/koth-admin/koth-admin-page";
import { BotsAdminPage } from "@pages/admin/bots-admin/bots-admin-page";
import { CryptoAdminPage } from "@pages/admin/crypto-admin/crypto-admin-page";
import { JackpotAdminPage } from "@pages/admin/jackpot-admin/jackpot-admin-page";
import { KycAdminPage } from "@pages/admin/kyc-admin/kyc-admin-page";
import { SystemAdminPage } from "@pages/admin/system-admin/system-admin-page";
import { RainAdminPage } from "@pages/admin/rain-admin/rain-admin-page";
import { PaymentsAdminPage } from "@pages/admin/payments-admin/payments-admin-page";
import { NewUsersAdminPage } from "@pages/admin/new-users-admin/new-users-admin-page";
import { ModTipAdminPage } from "@pages/admin/mod-tip-admin/mod-tip-admin-page";
import { CommunityConnectAdminPage } from "@pages/admin/community-connect-admin/community-connect-admin-page";
import { CasinoProvidersAdminPage } from "@pages/admin/casino-providers-admin/casino-providers-admin-page";
import { CasinoGamesAdminPage } from "@pages/admin/casino-games-admin/casino-games-admin-page";
import { GiftCardsAdminPage } from "@pages/admin/gift-cards-admin/gift-cards-admin-page";
import { BattlesAdminPage } from "@pages/admin/battles-admin/battles-admin-page";
import { CdnUploadAdminPage } from "@pages/admin/cdn-upload-admin/cdn-upload-admin-page";
import { EventsManagingAdminPage } from "@pages/admin/events-managing-admin/events-managing-admin-page";
import { DynamicDomainsAdminPage } from "@pages/admin/dynamic-domains-admin/dynamic-domains-admin-page";
import { OpenTradesAdminPage } from "@pages/admin/open-trades-admin/open-trades-admin-page";
import { PlainSqlAdminPage } from "@pages/admin/plain-sql-admin/plain-sql-admin-page";
import { StatsAdminPage } from "@pages/admin/stats-admin/stats-admin-page";
import { test as base } from "@playwright/test";
import { PriceWatchAdminPage } from "@pages/admin/price-watch-admin/price-watch-admin-page";
import { EvRewardsSystemAdminPage } from "@pages/admin/ev-rewards-system-admin/ev-rewards-system-admin-page";
import { IpBlockAdminPage } from "@pages/admin/ip-block-admin/ip-block-admin-page";
import { BaseAdminPage } from "@pages/admin/base-admin/base-admin-page";
import { OurGamesAdminPage } from "@pages/admin/our-games-admin/our-games-admin-page";
import { PromoCampaignsAdminPage } from "@pages/admin/promo-campaigns-admin/promo-campaigns-admin-page";
import { UserInfoTransactionsAdminPage } from "@pages/admin/user-info-admin/user-info-transactions-admin/user-info-transactions-admin-page";
import { SeoRedirectsAdminPage } from "@pages/admin/seo-redirects-admin/seo-redirects-admin-page";
import { PromotionAdminPage } from "@pages/admin/promotion-admin/promotion-admin-page";
import { UserInfoEditInfoAdminPage } from "@pages/admin/user-info-admin/user-info-edit-info-admin/user-info-edit-info-admin-page";
import { UserInfoRewardsAdminPage } from "@pages/admin/user-info-admin/user-info-rewards-admin/user-info-rewards-admin-page";
import { UserInfoRewardsHistoryAdminPage } from "@pages/admin/user-info-admin/user-info-rewards-history-admin/user-info-rewards-history-admin-page";
import { UserInfoKycAdminPage } from "@pages/admin/user-info-admin/user-info-kyc-admin/user-info-kyc-admin-page";
import { BulkActionsAdminPage } from "@pages/admin/bulk-actions-admin/bulk-actions-admin-page";
import { UserInfoSessionsAdminPage } from "@pages/admin/user-info-admin/user-info-sessions-admin/user-info-sessions-admin-page";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";
import { SportsBlogAdminPage } from "@pages/admin/sports-blog-admin/sports-blog-admin-page";

export type AdminPages = {
	browserSessionManager: BrowserSessionManager;
	baseAdminPage: BaseAdminPage;
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: UserInfoInfoAdminPage;
	transactionsAdminPage: UserInfoTransactionsAdminPage;
	freeSpinsAdminPage: FreeSpinsAdminPage;
	securityAdminPage: SecurityAdminPage;
	writerAdminPage: WriterAdminPage;
	writerAdminNewPage: WriterAdminNewPage;
	vipManagerAdminPage: VipManagerAdminPage;
	actionsAdminPage: ActionsAdminPage;
	affiliatesAdminPage: AffiliatesAdminPage;
	marketingAdminPage: MarketingAdminPage;
	featuresAdminPage: FeaturesAdminPage;
	testingAdminPage: TestingAdminPage;
	kothAdminPage: KothAdminPage;
	botsAdminPage: BotsAdminPage;
	cryptoAdminPage: CryptoAdminPage;
	jackpotAdminPage: JackpotAdminPage;
	kycAdminPage: KycAdminPage;
	priceWatchAdminPage: PriceWatchAdminPage;
	systemAdminPage: SystemAdminPage;
	rainAdminPage: RainAdminPage;
	ipBlockAdminPage: IpBlockAdminPage;
	paymentsAdminPage: PaymentsAdminPage;
	newUsersAdminPage: NewUsersAdminPage;
	modTipAdminPage: ModTipAdminPage;
	communityConnectAdminPage: CommunityConnectAdminPage;
	casinoProvidersAdminPage: CasinoProvidersAdminPage;
	casinoGamesAdminPage: CasinoGamesAdminPage;
	giftCardsAdminPage: GiftCardsAdminPage;
	promoCampaignsAdminPage: PromoCampaignsAdminPage;
	battlesAdminPage: BattlesAdminPage;
	cdnUploadAdminPage: CdnUploadAdminPage;
	eventsManagingAdminPage: EventsManagingAdminPage;
	dynamicDomainsAdminPage: DynamicDomainsAdminPage;
	evRewardsSystemAdminPage: EvRewardsSystemAdminPage;
	openTradesAdminPage: OpenTradesAdminPage;
	plainSqlAdminPage: PlainSqlAdminPage;
	statsAdminPage: StatsAdminPage;
	ourGamesAdminPage: OurGamesAdminPage;
	seoRedirectsAdminPage: SeoRedirectsAdminPage;
	promotionAdminPage: PromotionAdminPage;
	userInfoEditInfoAdminPage: UserInfoEditInfoAdminPage;
	userInfoRewardsAdminPage: UserInfoRewardsAdminPage;
	userInfoRewardsHistoryAdminPage: UserInfoRewardsHistoryAdminPage;
	userInfoKycAdminPage: UserInfoKycAdminPage;
	bulkActionsAdminPage: BulkActionsAdminPage;
	userInfoSessionsAdminPage: UserInfoSessionsAdminPage;
	sportsBlogAdminPage: SportsBlogAdminPage;
};

export const adminPagesFixtures = base.extend<AdminPages>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	baseAdminPage: sessionAwarePage(BaseAdminPage),
	userInfoAdminPage: sessionAwarePage(UserInfoAdminPage),
	infoAdminPage: sessionAwarePage(UserInfoInfoAdminPage),
	transactionsAdminPage: sessionAwarePage(UserInfoTransactionsAdminPage),
	freeSpinsAdminPage: sessionAwarePage(FreeSpinsAdminPage),
	securityAdminPage: sessionAwarePage(SecurityAdminPage),
	writerAdminPage: sessionAwarePage(WriterAdminPage),
	writerAdminNewPage: sessionAwarePage(WriterAdminNewPage),
	vipManagerAdminPage: sessionAwarePage(VipManagerAdminPage),
	actionsAdminPage: sessionAwarePage(ActionsAdminPage),
	affiliatesAdminPage: sessionAwarePage(AffiliatesAdminPage),
	marketingAdminPage: sessionAwarePage(MarketingAdminPage),
	featuresAdminPage: sessionAwarePage(FeaturesAdminPage),
	testingAdminPage: sessionAwarePage(TestingAdminPage),
	kothAdminPage: sessionAwarePage(KothAdminPage),
	botsAdminPage: sessionAwarePage(BotsAdminPage),
	cryptoAdminPage: sessionAwarePage(CryptoAdminPage),
	jackpotAdminPage: sessionAwarePage(JackpotAdminPage),
	kycAdminPage: sessionAwarePage(KycAdminPage),
	priceWatchAdminPage: sessionAwarePage(PriceWatchAdminPage),
	systemAdminPage: sessionAwarePage(SystemAdminPage),
	rainAdminPage: sessionAwarePage(RainAdminPage),
	ipBlockAdminPage: sessionAwarePage(IpBlockAdminPage),
	paymentsAdminPage: sessionAwarePage(PaymentsAdminPage),
	newUsersAdminPage: sessionAwarePage(NewUsersAdminPage),
	modTipAdminPage: sessionAwarePage(ModTipAdminPage),
	communityConnectAdminPage: sessionAwarePage(CommunityConnectAdminPage),
	casinoProvidersAdminPage: sessionAwarePage(CasinoProvidersAdminPage),
	casinoGamesAdminPage: sessionAwarePage(CasinoGamesAdminPage),
	giftCardsAdminPage: sessionAwarePage(GiftCardsAdminPage),
	promoCampaignsAdminPage: sessionAwarePage(PromoCampaignsAdminPage),
	battlesAdminPage: sessionAwarePage(BattlesAdminPage),
	cdnUploadAdminPage: sessionAwarePage(CdnUploadAdminPage),
	eventsManagingAdminPage: sessionAwarePage(EventsManagingAdminPage),
	dynamicDomainsAdminPage: sessionAwarePage(DynamicDomainsAdminPage),
	evRewardsSystemAdminPage: sessionAwarePage(EvRewardsSystemAdminPage),
	openTradesAdminPage: sessionAwarePage(OpenTradesAdminPage),
	plainSqlAdminPage: sessionAwarePage(PlainSqlAdminPage),
	statsAdminPage: sessionAwarePage(StatsAdminPage),
	ourGamesAdminPage: sessionAwarePage(OurGamesAdminPage),
	seoRedirectsAdminPage: sessionAwarePage(SeoRedirectsAdminPage),
	promotionAdminPage: sessionAwarePage(PromotionAdminPage),
	userInfoEditInfoAdminPage: sessionAwarePage(UserInfoEditInfoAdminPage),
	userInfoRewardsAdminPage: sessionAwarePage(UserInfoRewardsAdminPage),
	userInfoRewardsHistoryAdminPage: sessionAwarePage(
		UserInfoRewardsHistoryAdminPage,
	),
	userInfoKycAdminPage: sessionAwarePage(UserInfoKycAdminPage),
	bulkActionsAdminPage: sessionAwarePage(BulkActionsAdminPage),
	userInfoSessionsAdminPage: sessionAwarePage(UserInfoSessionsAdminPage),
	sportsBlogAdminPage: sessionAwarePage(SportsBlogAdminPage),
});
