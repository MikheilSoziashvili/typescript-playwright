import { CODESANDBOX_DOMAIN } from "@constants/domains";
import {
	HELP_FAIR_PAGE_ENDPOINT,
	LIMBO_GAME_PAGE_ENDPOINT,
} from "@constants/page-endpoints";
import { testDetails } from "@core/helpers/test-details-helper";
import { LimboBetTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { FooterLinkPlaceholder } from "@enums/footer-link-placeholders";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { LimboOgMeta } from "@enums/limbo/limbo-og-meta";
import { OriginalGame } from "@enums/original-games";
import { OgProperties } from "@enums/playwright/htmlOgProperties";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Limbo game tests",
	testDetails().withTags(JiraComponent.GAMDOM_ORIGINALS).apply(),
	() => {
		test.slow();
		testData()
			.fromCsvRaw({ file: CsvFilesName.LIMBO_MANUAL_MODE })
			.forEach((record) => {
				test(
					`[ENG-10738][Limbo] Manual mode - Bet: $${record.betAmount}, Multiplier: ${record.multiplier}x`,
					testDetails()
						.withTags(TestTag.ORIGINALS, TestTag.ACCEPTANCE)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({ browserSessionManager }) => {
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{
								reuseContext: true,
							},
						);

						const limboBetData = new LimboBetTestData({
							betAmount: parseFloat(record.betAmount),
							multiplier: parseFloat(record.multiplier),
						});

						await regularUser.pages.limboGamePage
							.steps()
							.navigateAndAssertRollButton();

						await regularUser.pages.limboGamePage
							.steps()
							.playAndVerifyBalanceUpdates(limboBetData);
					},
				);
			});
	},
);

test.describe(
	"Limbo autobet tests",
	testDetails().withTags(JiraComponent.LIMBO).apply(),
	() => {
		test.slow();
		testData()
			.fromCsvRaw({ file: CsvFilesName.LIMBO_AUTO_MODE })
			.forEach((record) => {
				test(
					`[ENG-10737][Limbo] Auto mode - Bet: $${record.betAmount}, Multiplier: ${record.multiplier}x`,
					testDetails()
						.withTags(TestTag.ORIGINALS, TestTag.ACCEPTANCE)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({ limboAutobetTestFlow, testDataPredefined }) => {
						const numberOfRounds =
							testDataPredefined.data.limboAutobet.numberOfRounds;

						const limboBetData = new LimboBetTestData({
							betAmount: parseFloat(record.betAmount),
							multiplier: parseFloat(record.multiplier),
						});

						await limboAutobetTestFlow.executeAutobetScenario({
							limboBetData,
							numberOfRounds,
						});
					},
				);
			});
	},
);

test.describe("Limbo footer, meta info and provably fair tests", () => {
	test(
		"[ENG-12028] Verify 'Limbo' redirection from Footer section redirects to game page",
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.LIMBO)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ homePage, footer }) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(OriginalGame.Limbo);
			await footer
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(LIMBO_GAME_PAGE_ENDPOINT, false);
		},
	);

	test(
		"[ENG-12028] Verify 'Limbo' meta info",
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.LIMBO)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ limboGamePage }) => {
			await limboGamePage.navigate();
			await limboGamePage
				.assertThat()
				.verifyOgPropertiesValues(
					[OgProperties.OG_TITLE, OgProperties.OG_DESCRIPTION],
					[LimboOgMeta.OG_TITLE, LimboOgMeta.OG_DESCRIPTION],
				);
		},
	);

	test(
		"[ENG-12028] Verify 'Provably Fair' redirection from Footer section redirects",
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.LIMBO)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ homePage, footer, helpPage, limboGamePage }) => {
			await homePage.navigate();
			await footer.openFooterLinkByPlaceholder(
				FooterLinkPlaceholder.PROVABLY_FAIR,
			);
			await footer
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(HELP_FAIR_PAGE_ENDPOINT, false);
			await helpPage
				.assertThat()
				.verifySampleCodeSectionByGameNameIsVisible(OriginalGame.Limbo);
			await helpPage.goToProvablyFairPagePerGame(OriginalGame.Limbo);
			await limboGamePage
				.assertThat()
				.verifyNewTabUrlParts([CODESANDBOX_DOMAIN]);
		},
	);
});
