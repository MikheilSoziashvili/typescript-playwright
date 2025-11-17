import { NewUsersAdminPage } from "@pages/admin/new-users-admin/new-users-admin-page";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";

export interface FetchUsersFilterScenario {
	fetchUsersByFilterName: string;
	fetchUsersByFilterStep: (
		page: NewUsersAdminPage,
		testDataPredefined: PredefinedDataSource,
	) => Promise<void> | void;
}
