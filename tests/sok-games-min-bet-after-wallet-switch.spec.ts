import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { Unit } from "@enums/units";
import { test } from "@fixtures/fixtures";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { predefined } from "test-data/sources/predefined";
import { testData } from "test-data/test-data-manager";

const { wallets } = predefined.sokGames;

test.describe(
	"[ENG-11134] SOK Games - Min bet after currency switch",
	testDetails()
		.withTags(
			JiraComponent.SOK_GAMES,
			JiraComponent.MINES,
			JiraComponent.PLINKO,
			JiraComponent.KENO,
			JiraComponent.POCKET_DICE,
			JiraComponent.LIMBO,
			JiraComponent.BLACKJACK,
		)
		.apply(),
	() => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.SOK_GAMES_MIN_BET_AFTER_CURRENCY_SWITCH,
			})
			.forEach((record) => {
				test(
					`[ENG-11134] ${record.game} - Min bet after wallet switch`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({ sokGamesPage, browserSessionManager }) => {
						test.slow();

						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{
								reuseContext: true,
								regularUserWalletOptions: {
									walletUnits: Object.values(Unit),
									amount: SUPER_HIGH_USER_AMOUNT,
								},
							},
						);

						const sokPage = sokGamesPage.forGame(record.game);
						await sokPage.navigate();

						await sokPage
							.steps()
							.switchAllWalletsVerifyAndBet(
								wallets,
								record.minBetAmount,
							);
					},
				);
			});
	},
);
