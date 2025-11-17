import { NewUsersAdminPage } from "@pages/admin/new-users-admin/new-users-admin-page";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";
import { FetchUsersFilterScenario } from "test-data/interfaces/domain/admin-new-users-domain-interfaces";

export class AdminNewUsersDomainData {
	public readonly fetchUsersByFilterScenarios: FetchUsersFilterScenario[] = [
		{
			fetchUsersByFilterName: "BETWEEN DATES - last month",
			fetchUsersByFilterStep: (
				page: NewUsersAdminPage,
				testDataPredefined: PredefinedDataSource,
			) =>
				page
					.steps()
					.fetchUsersByBetweenDatesFilter(
						testDataPredefined.data.datetime.dateOffset.LAST_MONTH,
					),
		},
		{
			fetchUsersByFilterName: "BETWEEN User IDs – from 350 to 450",
			fetchUsersByFilterStep: async (
				page: NewUsersAdminPage,
				testDataPredefined: PredefinedDataSource,
			): Promise<void> => {
				const { startUserID, endUserID } =
					testDataPredefined.data.admin.newUsersPage
						.betweenUserIDsFilter;
				await page
					.steps()
					.fetchUsersByBetweenUserIDsFilter(startUserID, endUserID);
			},
		},
	];
}
