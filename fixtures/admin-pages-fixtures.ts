import { ActionsAdminPage } from "@pages/admin/actions-admin/actions-admin-page";
import { AffiliatesAdminPage } from "@pages/admin/affiliates-admin/affiliates-admin-page";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { InfoAdminPage } from "@pages/admin/info-admin/info-admin-page";
import { SecurityAdminPage } from "@pages/admin/security-admin/security-admin-page";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { VipManagerAdminPage } from "@pages/admin/vip-manager/vip-manager-page";
import { WriterAdminPage } from "@pages/admin/writer-admin/writer-admin-page";
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
import { TransactionsAdminPage } from "@pages/admin/transactions-admin/transactions-admin-page";
import { SeoRedirectsAdminPage } from "@pages/admin/seo-redirects-admin/seo-redirects-admin-page";

export type AdminPages = {
	baseAdminPage: BaseAdminPage;
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: InfoAdminPage;
	transactionsAdminPage: TransactionsAdminPage;
	freeSpinsAdminPage: FreeSpinsAdminPage;
	securityAdminPage: SecurityAdminPage;
	writerAdminPage: WriterAdminPage;
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
};

export const adminPagesFixtures = base.extend<AdminPages>({
	baseAdminPage: async ({ page }, use) => {
		await use(new BaseAdminPage(page));
	},
	userInfoAdminPage: async ({ page }, use) => {
		await use(new UserInfoAdminPage(page));
	},
	infoAdminPage: async ({ page }, use) => {
		await use(new InfoAdminPage(page));
	},
	transactionsAdminPage: async ({ page }, use) => {
		await use(new TransactionsAdminPage(page));
	},
	freeSpinsAdminPage: async ({ page }, use) => {
		await use(new FreeSpinsAdminPage(page));
	},
	securityAdminPage: async ({ page }, use) => {
		await use(new SecurityAdminPage(page));
	},
	writerAdminPage: async ({ page }, use) => {
		await use(new WriterAdminPage(page));
	},
	vipManagerAdminPage: async ({ page }, use) => {
		await use(new VipManagerAdminPage(page));
	},
	actionsAdminPage: async ({ page }, use) => {
		await use(new ActionsAdminPage(page));
	},
	affiliatesAdminPage: async ({ page }, use) => {
		await use(new AffiliatesAdminPage(page));
	},
	marketingAdminPage: async ({ page }, use) => {
		await use(new MarketingAdminPage(page));
	},
	featuresAdminPage: async ({ page }, use) => {
		await use(new FeaturesAdminPage(page));
	},
	testingAdminPage: async ({ page }, use) => {
		await use(new TestingAdminPage(page));
	},
	kothAdminPage: async ({ page }, use) => {
		await use(new KothAdminPage(page));
	},
	botsAdminPage: async ({ page }, use) => {
		await use(new BotsAdminPage(page));
	},
	cryptoAdminPage: async ({ page }, use) => {
		await use(new CryptoAdminPage(page));
	},
	jackpotAdminPage: async ({ page }, use) => {
		await use(new JackpotAdminPage(page));
	},
	kycAdminPage: async ({ page }, use) => {
		await use(new KycAdminPage(page));
	},
	priceWatchAdminPage: async ({ page }, use) => {
		await use(new PriceWatchAdminPage(page));
	},
	systemAdminPage: async ({ page }, use) => {
		await use(new SystemAdminPage(page));
	},
	rainAdminPage: async ({ page }, use) => {
		await use(new RainAdminPage(page));
	},
	ipBlockAdminPage: async ({ page }, use) => {
		await use(new IpBlockAdminPage(page));
	},
	paymentsAdminPage: async ({ page }, use) => {
		await use(new PaymentsAdminPage(page));
	},
	newUsersAdminPage: async ({ page }, use) => {
		await use(new NewUsersAdminPage(page));
	},
	modTipAdminPage: async ({ page }, use) => {
		await use(new ModTipAdminPage(page));
	},
	communityConnectAdminPage: async ({ page }, use) => {
		await use(new CommunityConnectAdminPage(page));
	},
	casinoProvidersAdminPage: async ({ page }, use) => {
		await use(new CasinoProvidersAdminPage(page));
	},
	casinoGamesAdminPage: async ({ page }, use) => {
		await use(new CasinoGamesAdminPage(page));
	},
	giftCardsAdminPage: async ({ page }, use) => {
		await use(new GiftCardsAdminPage(page));
	},
	promoCampaignsAdminPage: async ({ page }, use) => {
		await use(new PromoCampaignsAdminPage(page));
	},
	battlesAdminPage: async ({ page }, use) => {
		await use(new BattlesAdminPage(page));
	},
	cdnUploadAdminPage: async ({ page }, use) => {
		await use(new CdnUploadAdminPage(page));
	},
	eventsManagingAdminPage: async ({ page }, use) => {
		await use(new EventsManagingAdminPage(page));
	},
	dynamicDomainsAdminPage: async ({ page }, use) => {
		await use(new DynamicDomainsAdminPage(page));
	},
	evRewardsSystemAdminPage: async ({ page }, use) => {
		await use(new EvRewardsSystemAdminPage(page));
	},
	openTradesAdminPage: async ({ page }, use) => {
		await use(new OpenTradesAdminPage(page));
	},
	plainSqlAdminPage: async ({ page }, use) => {
		await use(new PlainSqlAdminPage(page));
	},
	statsAdminPage: async ({ page }, use) => {
		await use(new StatsAdminPage(page));
	},
	ourGamesAdminPage: async ({ page }, use) => {
		await use(new OurGamesAdminPage(page));
	},
	seoRedirectsAdminPage: async ({ page }, use) => {
		await use(new SeoRedirectsAdminPage(page));
	},
});
