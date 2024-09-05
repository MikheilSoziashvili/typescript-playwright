import { USER_1_CREDENTIALS, USER_2_CREDENTIALS } from "@constants/credentials";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const VALID_USERNAME = USER_1_CREDENTIALS.username;
const VALID_USERNAME_PREFIX = "user";
const INVALID_USERNAME = "12$user";

test.describe("User info - serch by field", () => {
	test.use(storageStateUserAPI("superadmin", "password"));
	test("[ENG-1386] User info - serch by field (wild card)", async ({
		userInfoAdminPage,
		infoAdminPage,
	}) => {
		await userInfoAdminPage.navigate();
		await userInfoAdminPage.assertThat().isSearchByUsernameFieldDisplayed();
		await userInfoAdminPage.assertThat().isShowInfoButtonDisplayed();
		await userInfoAdminPage.clickSearchByUsernameField();
		await userInfoAdminPage
			.assertThat()
			.areNoResultsDisplayedForSearchByUsernameField();
		await userInfoAdminPage
			.steps()
			.searchUser({ username: INVALID_USERNAME, expectToBeFound: false });
		await userInfoAdminPage
			.steps()
			.searchUser({ username: VALID_USERNAME, expectToBeFound: true });
		await userInfoAdminPage.insertUsernameInSearchByUsernameInput(
			VALID_USERNAME_PREFIX,
		);
		await userInfoAdminPage
			.assertThat()
			.isSearchByUsernameResultDisplayed(USER_1_CREDENTIALS.username);
		await userInfoAdminPage
			.assertThat()
			.isSearchByUsernameResultDisplayed(USER_2_CREDENTIALS.username);

		await userInfoAdminPage.steps().showUserDetails(VALID_USERNAME);
		await infoAdminPage.assertThat().pageElementsAreVisible();
		await infoAdminPage
			.assertThat()
			.isUsernameDisplayedInTitle(VALID_USERNAME);
	});
});
