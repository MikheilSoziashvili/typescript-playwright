import { OriginalGame } from "@enums/original-games";
import { VisibilityOptions } from "@enums/visibility-options";
import { CrashGamePage } from "@pages/crash-game-page/crash-game-page";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HiloGamePage } from "@pages/hilo-game-page/hilo-game-page";
import { PlinkoGamePage } from "@pages/plinko-game-page/plinko-game-page";
import { RouletteGamePage } from "@pages/roulette-game-page/roulette-game-page";
import { APIRequestContext } from "@playwright/test";

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
	| PlinkoGamePage;

export type PoolConfigurationType = {
	host: string;
	user: string;
	password: string;
	database: string;
	port: number;
	max: number;
	idleTimeoutMillis: number;
	connectionTimeoutMillis: number;
};
