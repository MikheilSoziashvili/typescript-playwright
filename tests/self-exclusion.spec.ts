import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { testData } from "test-data/test-data-manager";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { SelfExclusionDays } from "@enums/self-exlusion-days";
import { CasinoGameName } from "@enums/casino-game";
import { Cryptocurrency } from "@enums/cryptocurrencies";

test.describe(
	"Self Exclusion",
	testDetails().withTags(JiraComponent.SELF_EXCLUSION).apply(),
	() => {
		test.use(storageStateNewUserDB());

		testData()
			.fromCsvParsed({
				file: CsvFilesName.ORIGINALS_SELF_EXCLUSION,
			})
			.forEach((record) => {
				test(
					`[ENG-4422] Verify self exclusion for ${record.period} in game - ${record.game}`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({ settingsPage, originalsPage }) => {
						const betAmount = 10;
						await settingsPage
							.steps()
							.navigateAndEnableSelfExclusion(record.period);
						await originalsPage.navigateToGame(record.game);
						await originalsPage.verifySelfExclusionMessageIsDisplayed(
							record.game,
							betAmount,
						);
					},
				);
			});

		const exclusionPeriods = Object.values(SelfExclusionDays);
		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-4422] Verify self exclusion in Casino for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ settingsPage, casinoPage }) => {
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
				`[ENG-4422] Verify self exclusion in Sports for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ settingsPage, sportsPage }) => {
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
				`[ENG-4422] Verify self exclusion in Wallet Deposit tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ settingsPage, walletModal, homePage }) => {
					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await homePage.navigateToWallet();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Bitcoin,
					);
					await walletModal
						.assertThat()
						.verifyDepositDisabledTextIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-4422] Verify self exclusion in Wallet Buy crypto tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ settingsPage, walletModal, homePage }) => {
					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(period);
					await homePage.navigateToWallet();
					await walletModal.openBuyCryptoTab();
					await walletModal.selectPaymentMethod(
						Cryptocurrency.Bitcoin,
					);
					await walletModal
						.assertThat()
						.verifyDepositDisabledTextIsDisplayed();
				},
			);
		});

		exclusionPeriods.forEach((period) => {
			test(
				`[ENG-4422] Verify self exclusion in Wallet Redeem tab for ${period}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ settingsPage, walletModal, homePage }) => {
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
