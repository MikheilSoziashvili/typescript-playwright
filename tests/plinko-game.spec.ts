import { test } from "@fixtures/fixtures";
import { CsvFilesName } from "@enums/csv-file-name";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";

test.describe("Plinko tests", () => {
	test.beforeAll(async ({}, testInfo) => {
		if (testInfo.project.name === "firefox") {
			testInfo.annotations.push({
				type: "performance",
				description: "https://gamdom.atlassian.net/browse/ENG-6628",
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
