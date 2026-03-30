import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestTag } from "@enums/test-tags";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Keno tests", () => {
	test.use(storageStateNewUserDB());
	test(
		`[ENG-5847] Keno - Stop Autobet actuates immediately`,
		testDetails()
			.withTags(JiraComponent.SOK_GAMES, JiraComponent.KENO, TestTag.ACCEPTANCE)
			.apply(),
		async ({ kenoGamePage, userBalanceHandler }) => {
			const betAmount = 1;
			await kenoGamePage.navigateAndWaitForGameToLoad();

			const initialAccountBalance =
				await userBalanceHandler.walletBalanceInFiatRounded();

			await kenoGamePage.insertBet(betAmount);
			await kenoGamePage.steps().startAutobet();
			await kenoGamePage.steps().stopAutobet();

			await kenoGamePage.authenticatedHeader
				.assertThat()
				.accountBalanceHasChanged(initialAccountBalance);
		},
	);
});
