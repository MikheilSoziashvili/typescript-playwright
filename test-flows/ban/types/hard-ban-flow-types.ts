import { TestInfo } from "@playwright/test";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { GamdomApi } from "@api/gamdom-api";
import { GamdomDb } from "database/gamdom-db";

export interface HardBanResponsibleGamblingParams {
	browserSessionManager: BrowserSessionManager;
	gamdomDb: GamdomDb;
	gamdomApi: GamdomApi;
	twoFaEnabled: boolean;
	testInfo: TestInfo;
	testData: {
		startingXp: number;
		walletAmount: number;
		royaltyLevel: number;
		rewardAmountCoins: number;
		betAmount: number;
		betMultiplier: number;
		banReason: string;
		withdrawalAddress: string;
	};
}
