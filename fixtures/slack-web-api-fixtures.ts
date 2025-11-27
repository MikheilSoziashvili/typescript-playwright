import { test as base } from "@playwright/test";
import * as Configuration from "../configuration";
import { SlackWebApi } from "@api/slack/slack-web-api";
import { SlackWebApiFactory } from "@api/slack/slack-web-api-factory";
import { SlackChannel } from "@enums/slack/slack-channels";

export type SlackWebApis = {
	slackCryptoLowWalletBalanceChannel: SlackWebApi;
};

export const slackWebApisFixtures = base.extend<SlackWebApis>({
	slackCryptoLowWalletBalanceChannel: async ({}, use) => {
		const factory = new SlackWebApiFactory(
			Configuration.slackBotTokens[
				SlackChannel.CRYPTO_LOW_WALLET_BALANCE_E2E
			],
		);
		const slackWebApiCryptoLowWalletBalanceChannel =
			await factory.forChannel(
				SlackChannel.CRYPTO_LOW_WALLET_BALANCE_E2E,
			);
		await use(slackWebApiCryptoLowWalletBalanceChannel);
	},
});
