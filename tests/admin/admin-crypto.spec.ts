import { test } from "@fixtures/fixtures";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { encodeCookieHeader } from "@core/utils/utils";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Admin - Crypto",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.CRYPTO)
		.apply(),
	() => {
		test(
			"[ENG-6406] [Admin][Crypto] Verify the Hourly Crypto Balances Snapshot Table",
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				browserSessionManager,
				cryptoAdminPage,
				hourlyCryptoBalancesListener,
				gamdomApiFacade,
			}) => {
				await browserSessionManager.loginAs(
					TestUserRole.ADMIN_CRYPTOSUPADMIN,
					{ reuseContext: true },
				);

				hourlyCryptoBalancesListener.startListening();

				await cryptoAdminPage.navigate();
				await cryptoAdminPage
					.assertThat()
					.hourlyCryptoBalancesTableHeaderColumnsCorrect();

				const hourlyCryptoBalances =
					await hourlyCryptoBalancesListener.getLastHourlyCryptoBalances();

				await cryptoAdminPage
					.assertThat()
					.hourlyCryptoBalancesTableRowCellsCorrect(
						hourlyCryptoBalances,
					);

				const headers = {
					Cookie: await encodeCookieHeader(
						browserSessionManager.activeUser.cookie,
					),
				};

				const updatedBalances =
					await gamdomApiFacade.waitUntilHourlyCryptoBalancesDataUpdated(
						hourlyCryptoBalances,
						headers,
					);

				await cryptoAdminPage.navigate();
				await cryptoAdminPage
					.assertThat()
					.hourlyCryptoBalancesTableHeaderColumnsCorrect();

				await cryptoAdminPage
					.assertThat()
					.hourlyCryptoBalancesTableRowCellsCorrect(updatedBalances);
			},
		);
	},
);
