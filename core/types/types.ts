import { EV_REWARD_FREE_SPINS_FILE_MAP } from "@constants/file-paths";
import { RegisterTestData } from "@dtos/test-data";
import { Protocol } from "@enums/api/protocols";
import { UtxoFeeEstimateMode } from "@enums/crypto/utxo";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { Currency } from "@enums/currencies";
import { HouseEdgeValue } from "@enums/house-edge-values";
import { JiraComponent } from "@enums/jira/jira-components";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { RainStatus } from "@enums/rain-status";
import { TestTag } from "@enums/test-tags";
import { Unit } from "@enums/units";
import { UserRoles } from "@enums/user-roles";
import { VisibilityOptions } from "@enums/visibility-options";
import { WalletType } from "@enums/wallet-types";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { KenoGamePage } from "@pages/keno-game/keno-game-page";
import { MinesGamePage } from "@pages/mines-game-page/mines-game-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { BookOfPyramidsPage } from "@pages/casino-games/bgaming/book-of-pyramids/book-of-pyramids-page";
import { CashVaultIPage } from "@pages/casino-games/hacksaw-gaming/cash-vault-i/cash-vault-i-page";
import { BookOfArabiaPage } from "@pages/casino-games/wickedgames/book-of-arabia/book-of-arabia-page";
import { LiveBaccaratSqueezePage } from "@pages/casino-games/evolution-gaming/live-baccarat-squeeze/live-baccarat-squeeze-page";
import { ZuluGoldPage } from "@pages/casino-games/elk-studios/zulu-gold/zulu-gold-page";
import { APIRequestContext, APIResponse, TestInfo } from "@playwright/test";
import { SweetBonanzaPage } from "@pages/casino-games/pragmatic-play/sweet-bonanza/sweet-bonanza-page";
import { SweetBonanzaCandyLandPage } from "@pages/casino-games/pragmatic-play-live/sweet-bonanza-candy-land/sweet-bonanza-candy-land-page";
import {
	PlinkoRiskOption,
	PlinkoRowsOption,
} from "@enums/plinko/plinko-game-options";
import { HiloBetOption } from "@enums/hilo-bet-options";

export type TestUserConfigurationObject = {
	username: string;
	password: string;
	role: string;
	tags: string[];
	affCode?: string;
	additional_info: string;
};

export type CredentialsType = {
	username: string;
	password: string;
	email?: string;
};

export type XmlData = {
	testsuites: { testsuite: XmlDataTestSuite[] };
};

export type XmlDataTestSuite = { testcase: XmlDataTestCase[] };
export type XmlDataTestCase = {
	$: XmlData$;
	properties?: XmlDataProperty[];
};

export type XmlDataProperty = { property: { $: XmlData$ }[] };
export type XmlData$ = {
	name: string;
	value?: string;
};

export type ProxyCredentialsType = {
	server: string;
	username: string;
	password: string;
};

export type PayloadType =
	| Record<string, string | number | boolean | object | null>
	| Record<string, string | number | boolean | object | null>[]
	| string;

export type BasePageNavigationParametersType = {
	endpoint?: {
		paths: string[];
		pathParams?: Record<string, string>;
		queryParams?: Record<string, string | string[]>;
	};
	link?: string;
	cookies?: { clearCookies: boolean };
};

export type RequestOptions = NonNullable<
	Parameters<APIRequestContext["fetch"]>[1]
>;

export type SocialMediaRecord = {
	static_page: string;
	social_account: string;
	external_url: string;
	social_media: string;
	gamdom_UrlPart: string;
	socialMedia_UrlPart: string;
	locator: string;
};
export type VisibilityResult =
	| VisibilityOptions.VISIBLE
	| VisibilityOptions.INVISIBLE;

export type ProviderDetails = {
	providerName: string;
	providerIdName: string;
	importedFrom: string;
};

export type OriginalGames = OriginalGame;

export type OriginalGamesPage =
	| DiceGamePage
	| CrashGamePage
	| HiloGamePage
	| RouletteGamePage
	| PlinkoGamePage
	| MinesGamePage
	| KenoGamePage;

export type CasinoGamesPage =
	| BookOfPyramidsPage
	| CashVaultIPage
	| BookOfArabiaPage
	| LiveBaccaratSqueezePage
	| ZuluGoldPage
	| SweetBonanzaPage
	| SweetBonanzaCandyLandPage;

export type PoolConfigurationType = {
	host: string;
	user: string;
	password: string;
	database: string;
	port: number;
	max: number;
};

export type DbPoolServiceConfiguration = {
	protocol: Protocol;
	url: string;
	port: number;
	serviceManager: {
		healthCheckTimeout: number;
		healthCheckInterval: number;
	};
};

export type RainResponse = APIResponse | RainStatus.ALREADY_ACTIVE;

export type RainOptions = {
	active: boolean;
	extraAmount: number;
	frequencyMins: number;
	maxAmount: number;
	minAmount: number;
	percentExtraAmount: number;
	headers?: Record<string, string>;
};

export type SendOptions = {
	comment?: string;
	commentTo?: string;
	subtractFee?: boolean;
	replaceable?: boolean;
	confTarget?: number;
	estimateMode?: UtxoFeeEstimateMode;
	avoidReuse?: boolean;
	feeRate?: number;
	verbose?: boolean;
};

export type UtxoRpcParams = (string | number | boolean | undefined)[];

export type AcceptDialogOptions = {
	expectedMessage?: string;
	inputText?: string;
	times?: number;
};

export type CryptoOperationOptions = {
	cryptoName: Cryptocurrency | CryptoTicker;
	deposit?: boolean;
	withdraw?: boolean;
};

export type WalletUnit = `${Unit}`;

export type NullableString = string | null;

export type NullableDateString = Date | string | null;

export type CalculateMinesMultiplierArgs = {
	stepNumber: number;
	mines: number;
	houseEdge: HouseEdgeValue.Mines;
	fieldSize?: number;
	precision?: number;
};

export type WalletBalanceItem = {
	/** Wallet denomination (COINS for fiat, *_SATOSHI / *_GWEI for crypto) */
	unit: Unit;

	/** Display currency returned by backend (always "USD" in your sample) */
	currencyName: Currency;

	/** Currency ⇄ USD conversion rate as text (backend sends string) */
	displayRate: string;

	/** Spot price of 1 unit of the crypto expressed in USD (string) */
	cryptoPrice: string;

	/** Raw wallet balance in the given `unit` (integer) */
	balance: number;

	/** DEFAULT (main wallet) or VAULT (storage wallet) */
	wallet_type: WalletType;
};

export type UserWithConfig = {
	role: UserRoles;
	userData: RegisterTestData;
	config: Record<string, unknown>;
};

export type AnyTag = TestTag | JiraComponent;

export type Viewport = { width: number; height: number };

export type FileKey = keyof typeof EV_REWARD_FREE_SPINS_FILE_MAP;

export type HostMatcher = string | RegExp | ((hostname: string) => boolean);

export type PollOrSkipOptions = {
	timeout: number;
	interval: number;
	reason: string;
	testInfo: TestInfo;
};

export type FireblocksConfig = {
	apiKey: string;
	secretKeyPath: string;
	baseUrl: string;
	vaultId: string;
	usdtAssetId: string;
	ethAssetId: string;
	solAssetId: string;
	trxAssetId: string;
	usdtTrxAssetId: string;
	usdcEthAssetId: string;
	usdcSolAssetId: string;
};

export type UtxoNodeConfig = {
	url: string;
	user: string;
	pass: string;
};

export type NotificationTimeWindow = {
	startTimestampSeconds: number;
	earliestAllowedTimestampSeconds: number;
	endTimeMs: number;
};

export type PlinkoBetOptions = {
	rowsValue?: PlinkoRowsOption;
	riskValue?: PlinkoRiskOption;
};

export type BetOption =
	| number
	| RouletteBetColor
	| HiloBetOption
	| PlinkoBetOptions;

export const isNumberBetOption = (option?: BetOption): option is number =>
	typeof option === "number";

export const isStringBetOption = (
	option?: BetOption,
): option is RouletteBetColor | HiloBetOption => typeof option === "string";

export const isObjectBetOptions = (
	option?: BetOption,
): option is PlinkoBetOptions => typeof option === "object";

export type DiceExpectedBalanceAfterRollParams = {
	accountBalanceBeforeBet: number;
	betAmount: number;
	multiplier?: number;
	isWin: boolean;
};
