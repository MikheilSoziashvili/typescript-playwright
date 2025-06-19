import { test } from "@fixtures/fixtures";
import { CsvFilesName } from "@enums/csv-file-name";
import { jiraIssueId, parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { UserMenuOption } from "@enums/user-menu-options";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { OriginalGame } from "@enums/original-games";

test.describe("Plinko tests", () => {
	test.describe("Plinko Sign-In feature tests", () => {
		test.beforeEach(async ({}, testInfo) => {
			if (testInfo.project.name === BrowserName.FIREFOX) {
				testInfo.annotations.push({
					type: AnnotationType.PERFORMANCE,
					description: jiraIssueId(6628),
				});
			}
		});

		for (const record of parse_csv(
			DATASETS_DIR,
			CsvFilesName.LOGIN_SUCCESSFUL,
		) as {
			username: string;
			password: string;
		}[]) {
			test(`[ENG-5128] Sign In feature on Plinko - Login successful: [Username: ${record.username}] [Password: ${record.password}] @smoke @originals`, async ({
				plinkoGamePage,
				loginModal,
			}) => {
				await plinkoGamePage.navigate();
				await plinkoGamePage.assertThat().signInButtonIsDisplayed();
				await plinkoGamePage.openLoginModal();
				await loginModal.login(record.username, record.password);
				await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
			});
		}
	});

	test.describe("Plinko game tests", () => {
		test.use(storageStateNewUserDB());
		test.slow();

		test("[ENG-5164] Verify Plinko is displayed in statistics and in the Last 24 Hours Stats", async ({
			plinkoGamePage,
			homePage,
			statisticsPage,
		}) => {
			const betAmount = 100;
			await plinkoGamePage.navigate();
			await plinkoGamePage.startManualBet(betAmount.toString());
			await plinkoGamePage.steps().waitForSlidersToBeActive();
			const betWinMultiplier = await plinkoGamePage
				.steps()
				.getInGameChipsHistoryButtonValue();
			await homePage.authenticatedHeader.navigateToUserMenuOption(
				UserMenuOption.STATISTICS,
			);

			await statisticsPage
				.assertThat()
				.last24HoursGameLargestProfitIs(
					OriginalGame.Plinko,
					betWinMultiplier,
					betAmount,
				);
		});
	});
});
