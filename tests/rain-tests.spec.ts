import { getCookieHeader, waitUntil } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Rain tests", () => {
	test.slow();

	const baseRainAmount = 0.67;

	test.beforeEach(async ({ gamdomApi }) => {
		const superAdminData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		const superAdminCookie = getCookieHeader(
			await gamdomApi.authenticateWithNewSuperAdminUser(superAdminData),
		);

		await gamdomApi.ensureRainExists({
			active: true,
			extraAmount: 1000,
			frequencyMins: 1,
			maxAmount: 1000,
			minAmount: 1000,
			percentExtraAmount: 5,
			headers: {
				Cookie: superAdminCookie,
			},
		});
	});

	test.use(storageStateNewUserAPI());

	test("[ENG-2863] Rain - try to claim the rain", async ({
		homePage,
		chat,
	}) => {
		await homePage.navigate();
		await chat.steps().openChatAndVerify();

		const initialAccountBalance =
			await homePage.authenticatedHeader.getAccountBalance();

		await chat.steps().waitUponRainAndClaim();
		await chat.assertThat().rainClaimedMessageIsDisplayed();

		const initialRainBotMessageCount =
			await chat.map.rainBotMessageLocator.count();

		await waitUntil(
			async () =>
				(await chat.map.rainBotMessageLocator.count()) >
				initialRainBotMessageCount,
			{
				errorMessage: "New rain bot message did not appear",
				timeoutSeconds:
					TimeoutSeconds.THIRTY + TimeoutSeconds.ONE_TWENTY,
				intervalSeconds: 2,
			},
		);

		const userCount = await chat.getRainUserCount();
		const expectedUserRainClaim = baseRainAmount / userCount;
		const expectedUserBalance =
			initialAccountBalance + expectedUserRainClaim;

		await homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedUserBalance);
	});
});
