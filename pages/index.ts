import { ActionsAdminPage } from "./admin/actions-admin/actions-admin-page";
import { AffiliatesAdminPage } from "./admin/affiliates-admin/affiliates-admin-page";
import { BaseAdminPage } from "./admin/base-admin/base-admin-page";
import { BattlesAdminPage } from "./admin/battles-admin/battles-admin-page";
import { BotsAdminPage } from "./admin/bots-admin/bots-admin-page";
import { BulkActionsAdminPage } from "./admin/bulk-actions-admin/bulk-actions-admin-page";
import { CasinoGamesAdminPage } from "./admin/casino-games-admin/casino-games-admin-page";
import { CasinoProvidersAdminPage } from "./admin/casino-providers-admin/casino-providers-admin-page";
import { CdnUploadAdminPage } from "./admin/cdn-upload-admin/cdn-upload-admin-page";
import { CommunityConnectAdminPage } from "./admin/community-connect-admin/community-connect-admin-page";
import { CryptoAdminPage } from "./admin/crypto-admin/crypto-admin-page";
import { DynamicDomainsAdminPage } from "./admin/dynamic-domains-admin/dynamic-domains-admin-page";
import { EvRewardsSystemAdminPage } from "./admin/ev-rewards-system-admin/ev-rewards-system-admin-page";
import { EventsManagingAdminPage } from "./admin/events-managing-admin/events-managing-admin-page";
import { FeaturesAdminPage } from "./admin/features-admin/features-admin-page";
import { FreeSpinsAdminPage } from "./admin/free-spins-admin/free-spins-admin-page";
import { GiftCardsAdminPage } from "./admin/gift-cards-admin/gift-cards-admin-page";
import { IpBlockAdminPage } from "./admin/ip-block-admin/ip-block-admin-page";
import { JackpotAdminPage } from "./admin/jackpot-admin/jackpot-admin-page";
import { KothAdminPage } from "./admin/koth-admin/koth-admin-page";
import { KycAdminPage } from "./admin/kyc-admin/kyc-admin-page";
import { MarketingAdminPage } from "./admin/marketing-admin/marketing-admin-page";
import { ModTipAdminPage } from "./admin/mod-tip-admin/mod-tip-admin-page";
import { NewUsersAdminPage } from "./admin/new-users-admin/new-users-admin-page";
import { OpenTradesAdminPage } from "./admin/open-trades-admin/open-trades-admin-page";
import { OurGamesAdminPage } from "./admin/our-games-admin/our-games-admin-page";
import { PaymentsAdminPage } from "./admin/payments-admin/payments-admin-page";
import { PlainSqlAdminPage } from "./admin/plain-sql-admin/plain-sql-admin-page";
import { PriceWatchAdminPage } from "./admin/price-watch-admin/price-watch-admin-page";
import { PromoCampaignsAdminPage } from "./admin/promo-campaigns-admin/promo-campaigns-admin-page";
import { PromotionAdminPage } from "./admin/promotion-admin/promotion-admin-page";
import { RainAdminPage } from "./admin/rain-admin/rain-admin-page";
import { SecurityAdminPage } from "./admin/security-admin/security-admin-page";
import { SeoRedirectsAdminPage } from "./admin/seo-redirects-admin/seo-redirects-admin-page";
import { StatsAdminPage } from "./admin/stats-admin/stats-admin-page";
import { SystemAdminPage } from "./admin/system-admin/system-admin-page";
import { TestingAdminPage } from "./admin/testing-admin/testing-admin-page";
import { UserInfoAdminPage } from "./admin/user-info-admin/user-info-admin-page";
import { UserInfoEditInfoAdminPage } from "./admin/user-info-admin/user-info-edit-info-admin/user-info-edit-info-admin-page";
import { UserInfoInfoAdminPage } from "./admin/user-info-admin/user-info-info-admin/user-info-info-admin-page";
import { UserInfoKycAdminPage } from "./admin/user-info-admin/user-info-kyc-admin/user-info-kyc-admin-page";
import { UserInfoRewardsAdminPage } from "./admin/user-info-admin/user-info-rewards-admin/user-info-rewards-admin-page";
import { UserInfoRewardsHistoryAdminPage } from "./admin/user-info-admin/user-info-rewards-history-admin/user-info-rewards-history-admin-page";
import { UserInfoSessionsAdminPage } from "./admin/user-info-admin/user-info-sessions-admin/user-info-sessions-admin-page";
import { UserInfoTransactionsAdminPage } from "./admin/user-info-admin/user-info-transactions-admin/user-info-transactions-admin-page";
import { VipManagerAdminPage } from "./admin/vip-manager/vip-manager-page";
import { WriterAdminPage } from "./admin/writer-admin/writer-admin-page";
import { AffiliatesPage } from "./affiliates/affiliates-page";
import { BannedUserPage } from "./banned-user/banned-user-page";
import { BlogPage } from "./blog/blog-page";
import { BlogCategoryPage } from "./blog/category/blog-category-page";
import { BlogPostPage } from "./blog/post/blog-post-page";
import { BookOfPyramidsPage } from "./casino-games/bgaming/book-of-pyramids/book-of-pyramids-page";
import { CashVaultIPage } from "./casino-games/hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { LiveBaccaratSqueezePage } from "./casino-games/evolution-gaming/live-baccarat-squeeze/live-baccarat-squeeze-page";
import { CasinoGamesUnifiedPage } from "./casino-games/casino-games-page";
import { CasinoPage } from "./casino/casino-game-page";
import { Notification } from "@components/notification/notification";
import { Chat } from "./components/chat/chat";
import { Footer } from "./components/footer/footer";
import { Toast } from "./components/toast/toast";
import { CrashGamePage } from "./crash-game-page/crash-game-page";
import { DiceGamePage } from "./dice-game-page/dice-game-page";
import { EsportsPage } from "./esports-page/esports-page";
import { GoogleAuthPage } from "./external/google/google-auth-page";
import { SteamAuthPage } from "./external/steam/steam-auth-page";
import { SteamBlockedPage } from "./external/steam/steam-blocked-page";
import { GeoblockedPage } from "./geoblocked/geoblocked-page";
import { FaqPage } from "./help/faq/faq-page";
import { HelpPage } from "./help/help-page";
import { HiloGamePage } from "./hilo-game-page/hilo-game-page";
import { HomePage } from "./home-page/home-page";
import { KenoGamePage } from "./keno-game/keno-game-page";
import { KothPage } from "./koth/koth-page";
import { MaintenancePage } from "./maintenance/maintenance-page";
import { MinesGamePage } from "./mines-game-page/mines-game-page";
import { LiveSupportModal } from "./modals/live-support-intercom-modal/live-support-intercom-modal";
import { LoginModal } from "./modals/login-modal/login-modal";
import { NewRedirectModal } from "./modals/new-redirect-modal/new-redirect-modal";
import { PromoCodeModal } from "./modals/promo-code-modal/promo-code-modal";
import { PromotionsModal } from "./modals/promotions-modal/promotions-modal";
import { SoftblockModalPage } from "./modals/softblock-modal/softblock-modal";
import { TipRainModal } from "./modals/tip-rain-modal/tip-rain-modal";
import { TipUserModal } from "./modals/tip-user-modal/tip-user-modal";
import { TransactionDetailsModal } from "./modals/transaction-details-modal/transaction-details-modal";
import { TwoFactorAuthModal } from "./modals/two-factor-authentication-modal/two-factor-auth-modal";
import { UserProfileModal } from "./modals/user-profile-modal/user-profile-modal";
import { WalletModal } from "./modals/wallet/wallet-modal";
import { NotificationsPage } from "./notifications/notifications-page";
import { OriginalsPage } from "./originals/originals-page";
import { PlinkoGamePage } from "./plinko-game-page/plinko-game-page";
import { PrivacyPage } from "./privacy/privacy-page";
import { ProfilePage } from "./profile/profile-page";
import { PromotionPage } from "./promotion/promotion-page";
import { PromotionsPage } from "./promotions/promotions-page";
import { ProvidersPage } from "./providers/providers-page";
import { RewardsExplorePage } from "./rewards/explore/rewards-explore-page";
import { RewardsPage } from "./rewards/rewards-page";
import { RouletteGamePage } from "./roulette-game-page/roulette-game-page";
import { SettingsPage } from "./settings/settings-page";
import { SlotsBattlePage } from "./slot-battle/slots-battle-page";
import { SportsPage } from "./sports/sports-page";
import { StatisticsPage } from "./statistics/statistics-page";
import { TransactionsPage } from "./transactions/transactions-page";
import { VerificationPage } from "./verification/verification-page";
import { BookOfArabiaPage } from "./casino-games/wickedgames/book-of-arabia/book-of-arabia-page";
import { PocketDicePage } from "./pocket-dice-game/pocket-dice-page";

export const GamdomPages = {
	homePage: HomePage,
	affiliatesPage: AffiliatesPage,
	settingsPage: SettingsPage,
	rewardsPage: RewardsPage,
	rewardsExplorePage: RewardsExplorePage,
	profilePage: ProfilePage,
	verificationPage: VerificationPage,
	statisticsPage: StatisticsPage,
	faqPage: FaqPage,
	geoblockedPage: GeoblockedPage,
	bannedUserPage: BannedUserPage,
	maintenancePage: MaintenancePage,
	esportsPage: EsportsPage,
	slotsBattlePage: SlotsBattlePage,
	blogCategoryPage: BlogCategoryPage,
	blogPage: BlogPage,
	blogPostPage: BlogPostPage,
	helpPage: HelpPage,
	casinoPage: CasinoPage,
	providersPage: ProvidersPage,
	kothPage: KothPage,
	transactionsPage: TransactionsPage,
	promotionsPage: PromotionsPage,
	promotionPage: PromotionPage,
	notificationsPage: NotificationsPage,
	privacyPage: PrivacyPage,
	sportsPage: SportsPage,
} as const;

export const GamdomAdminPages = {
	baseAdminPage: BaseAdminPage,
	userInfoAdminPage: UserInfoAdminPage,
	infoAdminPage: UserInfoInfoAdminPage,
	transactionsAdminPage: UserInfoTransactionsAdminPage,
	freeSpinsAdminPage: FreeSpinsAdminPage,
	securityAdminPage: SecurityAdminPage,
	writerAdminPage: WriterAdminPage,
	vipManagerAdminPage: VipManagerAdminPage,
	actionsAdminPage: ActionsAdminPage,
	affiliatesAdminPage: AffiliatesAdminPage,
	marketingAdminPage: MarketingAdminPage,
	featuresAdminPage: FeaturesAdminPage,
	testingAdminPage: TestingAdminPage,
	kothAdminPage: KothAdminPage,
	botsAdminPage: BotsAdminPage,
	cryptoAdminPage: CryptoAdminPage,
	jackpotAdminPage: JackpotAdminPage,
	kycAdminPage: KycAdminPage,
	priceWatchAdminPage: PriceWatchAdminPage,
	systemAdminPage: SystemAdminPage,
	rainAdminPage: RainAdminPage,
	ipBlockAdminPage: IpBlockAdminPage,
	paymentsAdminPage: PaymentsAdminPage,
	newUsersAdminPage: NewUsersAdminPage,
	modTipAdminPage: ModTipAdminPage,
	communityConnectAdminPage: CommunityConnectAdminPage,
	casinoProvidersAdminPage: CasinoProvidersAdminPage,
	casinoGamesAdminPage: CasinoGamesAdminPage,
	giftCardsAdminPage: GiftCardsAdminPage,
	promoCampaignsAdminPage: PromoCampaignsAdminPage,
	battlesAdminPage: BattlesAdminPage,
	cdnUploadAdminPage: CdnUploadAdminPage,
	eventsManagingAdminPage: EventsManagingAdminPage,
	dynamicDomainsAdminPage: DynamicDomainsAdminPage,
	evRewardsSystemAdminPage: EvRewardsSystemAdminPage,
	openTradesAdminPage: OpenTradesAdminPage,
	plainSqlAdminPage: PlainSqlAdminPage,
	statsAdminPage: StatsAdminPage,
	ourGamesAdminPage: OurGamesAdminPage,
	seoRedirectsAdminPage: SeoRedirectsAdminPage,
	promotionAdminPage: PromotionAdminPage,
	userInfoEditInfoAdminPage: UserInfoEditInfoAdminPage,
	userInfoRewardsAdminPage: UserInfoRewardsAdminPage,
	userInfoRewardsHistoryAdminPage: UserInfoRewardsHistoryAdminPage,
	userInfoKycAdminPage: UserInfoKycAdminPage,
	bulkActionsAdminPage: BulkActionsAdminPage,
	userInfoSessionsAdminPage: UserInfoSessionsAdminPage,
};

export const GamePages = {
	originalsPage: OriginalsPage,
	crashGamePage: CrashGamePage,
	diceGamePage: DiceGamePage,
	rouletteGamePage: RouletteGamePage,
	hiloGamePage: HiloGamePage,
	plinkoGamePage: PlinkoGamePage,
	minesGamePage: MinesGamePage,
	kenoGamePage: KenoGamePage,
	bookOfPyramidsPage: BookOfPyramidsPage,
	bubblesBonanzaPage: CashVaultIPage,
	bookOfArabiaPage: BookOfArabiaPage,
	liveBaccaratSqueezePage: LiveBaccaratSqueezePage,
	casinoGamesPage: CasinoGamesUnifiedPage,
	pocketDicePage: PocketDicePage,
} as const;

export const Components = {
	notifications: Notification,
	toast: Toast,
	chat: Chat,
	footer: Footer,
};

export const ExternalPages = {
	steamAuthPage: SteamAuthPage,
	steamBlockedPage: SteamBlockedPage,
	googleAuthPage: GoogleAuthPage,
};

export const Modals = {
	tipUserModal: TipUserModal,
	userProfileModal: UserProfileModal,
	liveSupportModal: LiveSupportModal,
	walletModal: WalletModal,
	twoFactorAuthModal: TwoFactorAuthModal,
	promoCodeModal: PromoCodeModal,
	tipRainModal: TipRainModal,
	loginModal: LoginModal,
	transactionDetailsModal: TransactionDetailsModal,
	softblockModal: SoftblockModalPage,
	newRedirectModal: NewRedirectModal,
	promotionsModal: PromotionsModal,
};

export const AllGamdomPages = {
	...GamdomPages,
	...GamdomAdminPages,
	...GamePages,
	...Components,
	...ExternalPages,
	...Modals,
} as const;

export type GamdomPagesType = typeof GamdomPages;
export type GamdomAdminPagesType = typeof GamdomAdminPages;
export type GamePagesType = typeof GamePages;
export type ComponentsType = typeof Components;
export type ExternalPagesType = typeof ExternalPages;
export type ModalsType = typeof Modals;
export type AllGamdomPagesType = typeof AllGamdomPages;

export type GamdomPageInstances = {
	[K in keyof GamdomPagesType]: InstanceType<GamdomPagesType[K]>;
};

export type GamdomAdminPageInstances = {
	[K in keyof GamdomAdminPagesType]: InstanceType<GamdomAdminPagesType[K]>;
};

export type GamePageInstances = {
	[K in keyof GamePagesType]: InstanceType<GamePagesType[K]>;
};

export type ComponentsInstances = {
	[K in keyof ComponentsType]: InstanceType<ComponentsType[K]>;
};

export type ExternalPageInstances = {
	[K in keyof ExternalPagesType]: InstanceType<ExternalPagesType[K]>;
};

export type ModalsInstances = {
	[K in keyof ModalsType]: InstanceType<ModalsType[K]>;
};

export type AllGamdomPageInstances = {
	[K in keyof AllGamdomPagesType]: InstanceType<AllGamdomPagesType[K]>;
};
