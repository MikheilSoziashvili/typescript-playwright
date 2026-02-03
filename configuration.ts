import { DEFAULT_DB_PORT } from "@constants/defaults";
import {
	veriffBaseUrl,
	veriffCallbackUrl,
	veriffPortalUrl,
} from "@constants/veriff";
import {
	DbPoolServiceConfiguration,
	FireblocksConfig,
	PoolConfigurationType,
	TestUserConfigurationObject,
} from "@core/types/types";
import { asString, getFilePath } from "@core/utils/utils";
import { Protocol } from "@enums/api/protocols";
import { ConfiguraitonUrl } from "@enums/configuration-urls";
import { LogLevel } from "@enums/log-levels";
import { SlackChannel } from "@enums/slack/slack-channels";
import { Timeout } from "@enums/timeout";
import "dotenv/config";

export const isScheduledRun = process.env.GITHUB_EVENT_NAME === "schedule";
export const isCI = process.env.CI === "true";
const shouldCreateExecution = process.env.CREATE_TEST_EXECUTION === "true";
export const enableNewDesignV4Feature =
	process.env.ENABLE_NEW_DESIGN_V4 === "true";

export const environment_url = process.env.CI
	? asString(process.env.ENVIRONMENT_URL)
	: "https://qa-for-e2e-tests.teamgamdom.com";
export const logLevel = isCI ? LogLevel.WARN : LogLevel.INFO;
export const createExecution: boolean =
	isScheduledRun || (isCI && shouldCreateExecution);
export const enableLocalJiraFailedTestsReporter = false;
// Disable here to keep the legacy slack reporter implementation
export const slackReporter: boolean = process.env.CI ? false : false;
export const reportName: string = getFilePath("results.xml", "./");
export const jiraFailedTestsReportName: string = getFilePath(
	"e2e-results.json",
	"./",
);
export const keystore: string = getFilePath("keystore.json", "./");

export const slack: Record<string, string | string[]> = {
	webHookUrl: asString(process.env.SLACK_REPORTER_WEBHOOK_URL),
	oAuthToken: asString(process.env.SLACK_BOT_USER_OAUTH_TOKEN),
	channels: ["playwright-e2e-reporting"],
};
export const slackBotTokens: Record<SlackChannel, string> = {
	[SlackChannel.CRYPTO_LOW_WALLET_BALANCE_E2E]: asString(
		process.env.SLACK_CRYPTO_LOW_WALLET_BALANCE_E2E_BOT_TOKEN,
	),
};
export const jira: Record<string, string> = {
	baseUrl: ConfiguraitonUrl.JIRA,
	projectKey: "ENG",
	username: asString(process.env.JIRA_USERNAME),
	token: asString(process.env.JIRA_TOKEN),
};
export const mailpit = {
	baseUrl: process.env.MAILPIT_BASE_URL ?? ConfiguraitonUrl.MAILPIT,
};
export const xray: Record<string, string> = {
	baseUrl: ConfiguraitonUrl.XRAY,
	clientId: asString(process.env.XRAY_CLIENT_ID),
	clientSecret: asString(process.env.XRAY_CLIENT_SECRET),
};

export const hotWalletConfig = {
	adminApiKey: asString(process.env.E2E_HOT_WALLET_CONFIG_ADMIN_API_KEY),
};

export const coingecko: Record<string, string> = {
	baseUrl: ConfiguraitonUrl.COINGECKO,
	apiKey: asString(process.env.COINGECKO_API_KEY),
};

export const steam: Record<string, string> = {
	username: asString(process.env.STEAM_USERNAME),
	password: asString(process.env.STEAM_PASSWORD),
	bannedUsername: asString(process.env.STEAM_BANNED_USERNAME),
	bannedUser: asString(process.env.BANNED_STEAM_USER),
};

export const google: Record<string, string> = {
	email: asString(process.env.GOOGLE_EMAIL),
	password: asString(process.env.GOOGLE_PASSWORD),
	authSecret: asString(process.env.GOOGLE_AUTH_SECRET),
};

export const oxylabs: Record<string, string> = {
	username: asString(process.env.OXYLABS_USER),
	password: asString(process.env.OXYLABS_PASSWORD),
};

export const poolConfig: PoolConfigurationType = {
	host: asString(process.env.DB_HOST),
	user: asString(process.env.DB_USER),
	password: asString(process.env.DB_PASSWORD),
	database: asString(process.env.DB_NAME),
	port: parseInt(process.env.DB_PORT || DEFAULT_DB_PORT),
	max: 50,
};

export const dbPoolServiceConfig: DbPoolServiceConfiguration = {
	protocol: Protocol.HTTP,
	url: "localhost",
	port: Number(process.env.DB_POOL_SERVICE_PORT ?? 3030),
	serviceManager: {
		healthCheckTimeout: Timeout.LONG,
		healthCheckInterval: Timeout.SHORT,
	},
};

export const BitcoinConfig = {
	host: asString(process.env.BITCOIN_RPC_HOST),
	port: asString(process.env.BITCOIN_RPC_PORT),
	user: asString(process.env.BITCOIN_RPC_USER),
	pass: asString(process.env.BITCOIN_RPC_PASS),
	url: `http://${asString(process.env.BITCOIN_RPC_HOST)}:${asString(
		process.env.BITCOIN_RPC_PORT,
	)}`,
};

export const LitecoinConfig = {
	host: asString(process.env.BITCOIN_RPC_HOST),
	port: asString(process.env.LITECOIN_RPC_PORT),
	user: asString(process.env.BITCOIN_RPC_USER),
	pass: asString(process.env.BITCOIN_RPC_PASS),
	url: `http://${asString(process.env.BITCOIN_RPC_HOST)}:${asString(
		process.env.LITECOIN_RPC_PORT,
	)}`,
};

export const fireblocks: FireblocksConfig = {
	apiKey: asString(process.env.FIREBLOCKS_API_KEY),
	secretKeyPath: asString(process.env.FIREBLOCKS_SECRET_KEY_PATH),
	baseUrl: asString(process.env.FIREBLOCKS_BASE_URL),
	vaultId: asString(process.env.FIREBLOCKS_VAULT_ID),
	usdtAssetId: asString(process.env.FIREBLOCKS_USDT_ASSET_ID),
	ethAssetId: asString(process.env.FIREBLOCKS_ETH_ASSET_ID),
	solAssetId: asString(process.env.FIREBLOCKS_SOL_ASSET_ID),
	trxAssetId: asString(process.env.FIREBLOCKS_TRX_ASSET_ID),
	usdtTrxAssetId: asString(process.env.FIREBLOCKS_USDT_TRX_ASSET_ID),
	usdcEthAssetId: asString(process.env.FIREBLOCKS_USDC_ETH_ASSET_ID),
	usdcSolAssetId: asString(process.env.FIREBLOCKS_USDC_SOL_ASSET_ID),
	usd1EthAssetId: asString(process.env.FIREBLOCKS_USD1_ETH_ASSET_ID),
	usd1SolAssetId: asString(process.env.FIREBLOCKS_USD1_SOL_ASSET_ID),
	usdtBscAssetId: asString(process.env.FIREBLOCKS_USDT_BSC_ASSET_ID),
	usdcBscAssetId: asString(process.env.FIREBLOCKS_USDC_BSC_ASSET_ID),
	bnbAssetId: asString(process.env.FIREBLOCKS_BNB_ASSET_ID),
};

export const xrpTestnet = {
	walletSeed: asString(process.env.XRP_TESTNET_WALLET_SEED),
	rpcUrl: asString(process.env.XRP_TESTNET_RPC_URL),
	faucetUrl: asString(process.env.XRP_TESTNET_FAUCET_URL),
	walletSeedWorker0: process.env.XRP_TESTNET_WALLET_SEED_WORKER_0 || "",
	walletSeedWorker1: process.env.XRP_TESTNET_WALLET_SEED_WORKER_1 || "",
	walletSeedWorker2: process.env.XRP_TESTNET_WALLET_SEED_WORKER_2 || "",
	walletSeedWorker3: process.env.XRP_TESTNET_WALLET_SEED_WORKER_3 || "",
	walletSeedWorker4: process.env.XRP_TESTNET_WALLET_SEED_WORKER_4 || "",
};

export const dogeTestnet = {
	privateKey: asString(process.env.DOGE_TESTNET_PRIVATE_KEY),
	address: asString(process.env.DOGE_TESTNET_ADDRESS),
};

export const veriffConfig = {
	apiUrl: asString(veriffBaseUrl),
	callBackUrl: asString(veriffCallbackUrl),
	portalUrl: asString(veriffPortalUrl),
	username: asString(process.env.VERIFF_USERNAME),
	password: asString(process.env.VERIFF_PASSWORD),
	secret2FA: asString(process.env.VERIFF_SECRET_2FA),
};

export const hourlyCryptoBalancesCronInterval = Number(
	process.env.HOURLY_CRYPTO_BALANCES_CRON_INTERVAL ?? Timeout.LONG,
);

// ReportPortal Configuration
export const branchName =
	process.env.GITHUB_REF_NAME || process.env.BRANCH_NAME || "local";

export const reportPortal = {
	enabled: process.env.RP_ENABLED === "true",
	apiKey: asString(process.env.RP_API_KEY),
	endpoint: asString(process.env.RP_ENDPOINT),
	project: asString(process.env.RP_PROJECT),
	launchName: asString(process.env.RP_LAUNCH_NAME || "Playwright E2E Tests"),
	launchId: process.env.RP_LAUNCH_ID,
	mode: process.env.RP_MODE || "DEFAULT",
};

export const users: TestUserConfigurationObject[] = [
	{
		username: "superadmin",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin1",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin2",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin3",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin4",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin5",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "supportadmin",
		password: "password",
		role: "admin",
		tags: ["SupportStaff"],
		additional_info: "",
	},
	{
		username: "marketingadmin",
		password: "password",
		role: "admin",
		tags: ["MarketingStaff"],
		additional_info: "",
	},
	{
		username: "vipadmin",
		password: "password",
		role: "admin",
		tags: ["VIPStaff"],
		additional_info: "",
	},
	{
		username: "socialadmin",
		password: "password",
		role: "admin",
		tags: ["SocialMediaStaff"],
		additional_info: "",
	},
	{
		username: "moderator1",
		password: "password",
		role: "moderator",
		tags: [],
		additional_info: "",
	},
	{
		username: "moderator2",
		password: "password",
		role: "moderator",
		tags: [],
		additional_info: "not email verified",
	},
	{
		username: "streamer1",
		password: "password",
		role: "user",
		tags: ["streamer", "streamervip"],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "streamer2",
		password: "password",
		role: "user",
		tags: ["streamer", "marketing2"],
		affCode: "streamer2",
		additional_info: "",
	},
	{
		username: "user1",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "user2",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "user3",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer2",
		additional_info: "",
	},
	{
		username: "user4",
		password: "password",
		role: "user",
		tags: ["marketing1"],
		additional_info: "",
	},
	{
		username: "user5",
		password: "password",
		role: "user",
		tags: [],
		additional_info: "not email verified",
	},
];
