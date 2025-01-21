import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { DATASETS_DIR } from "@constants/file-paths";
import { ADMIN_IP_USERS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { environment_url } from "configuration";

const ipAddressInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.USER_INFO_SEARCH_BY_IP_ADDRESS,
) as {
	value: string;
}[];

ipAddressInputs.forEach((input) => {
	test.describe("User info - search by IP", () => {
		test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));
		test(`[ENG-1456] User info - Search by '${input.value}' IP`, async ({
			userInfoAdminPage,
			baseAdminPage,
		}) => {
			await userInfoAdminPage.navigate();
			await userInfoAdminPage
				.assertThat()
				.searchByIPElementsDisplayed();
			await userInfoAdminPage.searchForIP(`${input.value}`);
			await baseAdminPage
				.assertThat()
				.verifyCurrentUrlIs(
					`${environment_url}${ADMIN_IP_USERS_PAGE_ENDPOINT}/${input.value}`,
					true,
				);
		});
	});
});
