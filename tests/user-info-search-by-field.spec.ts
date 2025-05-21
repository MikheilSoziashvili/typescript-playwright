import {
	generateRandomString,
	getRegisterDataRandomUsernameWithPrefix,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "../fixtures/auth-fixtures";

const VALID_USERNAME_PREFIX = `${generateRandomString({ length: 5 })}_`;
const users = {
	defaultUser: new RegisterTestData(),
	firstUser: getRegisterDataRandomUsernameWithPrefix(VALID_USERNAME_PREFIX),
	secondUser: getRegisterDataRandomUsernameWithPrefix(VALID_USERNAME_PREFIX),
};
const VALID_USERNAME = users.defaultUser.username;
const INVALID_USERNAME = "12$user";

test.describe("User info - search by field", () => {
	test.beforeAll(async ({ gamdomDb }) => {
		await Promise.all(
			Object.values(users).map((user) => gamdomDb.createNewUser(user)),
		);
	});

	test.use(storageStateNewSuperAdminUserDB());

	test("[ENG-1386] User info - search by field (wild card)", async ({
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
			.isSearchByUsernameResultDisplayed(users.firstUser.username);
		await userInfoAdminPage
			.assertThat()
			.isSearchByUsernameResultDisplayed(users.secondUser.username);

		await userInfoAdminPage.steps().showUserDetails(VALID_USERNAME);
		await infoAdminPage.assertThat().pageElementsAreVisible();
		await infoAdminPage
			.assertThat()
			.isUsernameDisplayedInTitle(VALID_USERNAME);
	});
});
