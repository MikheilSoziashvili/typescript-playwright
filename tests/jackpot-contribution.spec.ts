import { testDetails } from "@core/helpers/test-details-helper";
import { ApiPromises } from "@core/types/browser-session-mngmt-types";
import { CsvFilesName } from "@enums/csv-file-name";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { APIResponse } from "@playwright/test";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { JackpotContributionCsvParsedRecord } from "test-data/parsers/jackpot-contribution-csv-parser";
import { predefined } from "test-data/sources/predefined";
import { testData } from "test-data/test-data-manager";

const jackpotContributionScenarios: JackpotContributionCsvParsedRecord[] =
	testData().fromCsvParsed({
		file: CsvFilesName.JACKPOT_CONTRIBUTION,
	});

const placeBetForGame: Record<
	string,
	(apis: ApiPromises, amount: number) => Promise<APIResponse>
> = {
	[OriginalGame.Crash]: async (apis, amount) =>
		(await apis.crashApi).placeBetUntilSuccessful(
			amount,
			predefined.crash.defaultAutoCashOutApi,
		),
	[OriginalGame.HiLo]: async (apis, amount) =>
		(await apis.hiloApi).placeBetUntilSuccessful(amount, HiloBetOption.RED),
	[OriginalGame.Roulette]: async (apis, amount) =>
		(await apis.rouletteApi).placeBetUntilSuccessful(
			amount,
			RouletteBetColor.RED,
		),
};

test.describe("Jackpot Contribution percentage validation", () => {
	for (const {
		game,
		betAmountInCoins,
		expectedJackpotIncrease,
	} of jackpotContributionScenarios) {
		test(
			`[ENG-11717] Jackpot increases by ${expectedJackpotIncrease} when betting ${betAmountInCoins} coins on ${game}`,
			testDetails()
				.withTags(JiraComponent.JACKPOT)
				.withAuthor(JiraUser.ANGEL_PETROV)
				.apply(),
			async ({ browserSessionManager }) => {
				const user = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{
						reuseContext: true,
						regularUserOptions: {
							amount: SUPER_HIGH_USER_AMOUNT,
						},
					},
				);

				await user.pages.originalsPage.navigateToGame(game);

				const previousJackpotAmount =
					await user.pages.originalsPage.getJackpotAmount();

				await placeBetForGame[game](user.apis, betAmountInCoins);

				await user.pages.originalsPage
					.assertThat()
					.jackpotIncreasedBy(
						previousJackpotAmount,
						expectedJackpotIncrease,
					);
			},
		);
	}
});
