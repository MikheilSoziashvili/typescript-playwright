import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { testData } from "test-data/test-data-manager";
import { SelfExclusionDays } from "@enums/self-exlusion-days";
import { CasinoGameName } from "@enums/casino-game";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Self Exclusion",
	testDetails().withTags(JiraComponent.SELF_EXCLUSION).apply(),
	() => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.ORIGINALS_SELF_EXCLUSION,
			})
			.forEach((record) => {
				test(
					`[ENG-11763] Verify self exclusion for ${record.period} in game - ${record.game}`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ testDataObject, browserSessionManager }) => {
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{
								reuseContext: true,
							},
						);

						const betTestData = testDataObject.bet.build(
							{
								username:
									regularUser.getAuthenticatedUser().user
										.username,
							},
							{ betAmount: 10 },
						);
						await regularUser.pages.settingsPage
							.steps()
							.navigateAndEnableSelfExclusion(record.period);
						await regularUser.pages.originalsPage.navigateToGame(
							record.game,
						);
						await regularUser.pages.originalsPage.verifySelfExclusionMessageIsDisplayed(
							record.game,
							betTestData.betAmount,
						);
					},
				);
			});

		const exclusionPeriods = Object.values(SelfExclusionDays);
		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-11763] Verify self exclusion in Casino for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ settingsPage, casinoPage, browserSessionManager }) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});
					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await casinoPage.navigate();
					await casinoPage.searchForGame(
						CasinoGameName.BARREL_BONANZA,
					);
					await casinoPage.openGameFromDropdown(
						CasinoGameName.BARREL_BONANZA,
					);
					await casinoPage
						.assertThat()
						.selfExclusionToastMessageIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-11763] Verify self exclusion in Sports for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ settingsPage, sportsPage, browserSessionManager }) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});
					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await sportsPage.navigate();
					await sportsPage
						.assertThat()
						.selfExclusionToastMessageIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-11763] Verify self exclusion in Wallet Deposit tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager }) => {
					const adminUser = await browserSessionManager.loginAs(
						TestUserRole.SUPERADMIN,
						{ reuseContext: true },
					);
					const regularUser = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
					);

					await adminUser.pages.cryptoAdminPage.navigate();
					await adminUser.pages.cryptoAdminPage.toggleCryptoOperations(
						[
							{
								cryptoName: Cryptocurrency.Bitcoin,
								deposit: true,
								withdraw: true,
							},
						],
					);

					await regularUser.pages.settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await regularUser.pages.homePage.navigateToWallet();
					await regularUser.pages.walletModal.selectPaymentMethod(
						Cryptocurrency.Bitcoin,
					);
					await regularUser.pages.walletModal
						.assertThat()
						.verifyDepositDisabledTextIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-11763] Verify self exclusion in Wallet Buy crypto tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager }) => {
					const regularUser = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
					);

					await regularUser.pages.settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await regularUser.pages.homePage.navigateToWallet();
					await regularUser.pages.walletModal.openBuyCryptoTab();

					await regularUser.pages.walletModal
						.assertThat()
						.verifyDepositDisabledTextIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-11763] Verify self exclusion in Wallet Redeem tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					settingsPage,
					walletModal,
					homePage,
					browserSessionManager,
				}) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});

					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await homePage.navigateToWallet();
					await walletModal.openRedeemTab();
					await walletModal
						.assertThat()
						.verifyDepositDisabledTextIsDisplayed();
				},
			);
		});
	},
);
