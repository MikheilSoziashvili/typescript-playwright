import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";

test.describe("Ban user from linking platforms", () => {
	const userData = new RegisterTestData();

	test.beforeAll(async ({ gamdomDb }) => {
		await gamdomDb.createNewUser({
			username: userData.username,
			password: userData.password,
			email: userData.email,
			emailVerified: true,
		});
	});

	for (const record of parse_csv(
		DATASETS_DIR,
		CsvFilesName.LINKED_PLATFORMS,
	) as {
		platform: string;
		tableValue: string;
	}[]) {
		test.use(storageStateNewSuperAdminUserDB());

		test(
			`[ENG-1540] UserInfo - Info - Community connect actions: ban linking of ${record.platform}`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ userInfoAdminPage, infoAdminPage }) => {
				await userInfoAdminPage.navigate();
				await userInfoAdminPage
					.steps()
					.showUserDetails(userData.username);

				await infoAdminPage
					.steps()
					.banUserFromLinkingPlatform(
						record.platform,
						record.tableValue,
					);

				await infoAdminPage
					.steps()
					.enableUserToLinkPlatform(
						record.platform,
						record.tableValue,
					);
			},
		);
	}
});
