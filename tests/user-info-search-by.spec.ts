import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { DATASETS_DIR } from "@constants/file-paths";
import {
	ADMIN_IP_USERS_PAGE_ENDPOINT,
	INFO_ADMIN_PAGE_ENDPOINT,
} from "@constants/page-endpoints";
import { createUsers, getUserIds } from "@core/utils/user-setup-utils";
import {
	generateRandomString,
	getRegisterDataRandomUsernameWithPrefix,
	parse_csv,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { UserRoles } from "@enums/user-roles";
import {
	storageStateNewSuperAdminUserDB,
	storageStateUserAPI,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const ipAddressInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.USER_INFO_SEARCH_BY_IP_ADDRESS,
) as {
	value: string;
}[];

test.describe("User info - search by", () => {
	test.describe("User info - search by ID", () => {
		const userData = new RegisterTestData();
		let userId: number;

		test.use(storageStateNewSuperAdminUserDB());

		test.beforeAll(async ({ gamdomDb, gamdomApi }) => {
			await gamdomDb.createNewUser({
				username: userData.username,
				password: userData.password,
				email: userData.email,
				emailVerified: true,
			});

			userId = (
				await gamdomApi.getBasicInfo(
					userData.username,
					userData.password,
				)
			).user.id;
		});

		test(`[ENG-4990] User info - simple search by ID`, async ({
			userInfoAdminPage,
			baseAdminPage,
		}) => {
			await userInfoAdminPage.navigate();
			await userInfoAdminPage
				.assertThat()
				.searchBySteam64orUserIdElementsDisplayed();
			await userInfoAdminPage.searchForSteam64OrUserId(userId);
			await baseAdminPage
				.assertThat()
				.waitForAndVerifyCurrentUrlIs(
					`${INFO_ADMIN_PAGE_ENDPOINT}/${userId}`,
					true,
				);
		});
	});

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
					.waitForAndVerifyCurrentUrlIs(
						`${ADMIN_IP_USERS_PAGE_ENDPOINT}/${input.value}`,
						true,
					);
			});
		});
	});

	test.describe("User info - search by field", () => {
		const VALID_USERNAME_PREFIX = `${generateRandomString({ length: 5 })}_`;
		const users = {
			defaultUser: new RegisterTestData(),
			firstUser: getRegisterDataRandomUsernameWithPrefix(
				VALID_USERNAME_PREFIX,
			),
			secondUser: getRegisterDataRandomUsernameWithPrefix(
				VALID_USERNAME_PREFIX,
			),
		};
		const VALID_USERNAME = users.defaultUser.username;
		const INVALID_USERNAME = "12$user";

		test.beforeAll(async ({ gamdomDb }) => {
			await Promise.all(
				Object.values(users).map((user) =>
					gamdomDb.createNewUser(user),
				),
			);
		});

		test.use(storageStateNewSuperAdminUserDB());

		test("[ENG-1386] User info - search by field (wild card)", async ({
			userInfoAdminPage,
			infoAdminPage,
		}) => {
			await userInfoAdminPage.navigate();
			await userInfoAdminPage
				.assertThat()
				.isSearchByUsernameFieldDisplayed();
			await userInfoAdminPage.assertThat().isShowInfoButtonDisplayed();
			await userInfoAdminPage.clickSearchByUsernameField();
			await userInfoAdminPage
				.assertThat()
				.areNoResultsDisplayedForSearchByUsernameField();
			await userInfoAdminPage.steps().searchUser({
				username: INVALID_USERNAME,
				expectToBeFound: false,
			});
			await userInfoAdminPage.steps().searchUser({
				username: VALID_USERNAME,
				expectToBeFound: true,
			});
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
});

test.describe("User info - user badges", () => {
	test.use(storageStateNewSuperAdminUserDB());

	const userRoleData = Array.from(
		{ length: 3 },
		() => new RegisterTestData(),
	);
	const [userStreamerData, adminUserData, moderatorUserData] = userRoleData;

	const usersWithConfigs = [
		{
			role: UserRoles.Streamer,
			userData: userStreamerData,
			config: { tags: UserTags.Streamer, userClass: UserClasses.User },
		},
		{
			role: UserRoles.Admin,
			userData: adminUserData,
			config: { userClass: UserClasses.Admin },
		},
		{
			role: UserRoles.Moderator,
			userData: moderatorUserData,
			config: { userClass: UserClasses.Moderator },
		},
	];

	let userIds: Record<string, number>;

	test.beforeAll(async ({ gamdomDb, gamdomApi }) => {
		await createUsers(usersWithConfigs, gamdomDb);
		userIds = await getUserIds(usersWithConfigs, gamdomApi);
	});

	usersWithConfigs.forEach(({ role }) => {
		test(
			`[ENG-7562] User info - user badges - ${role}`,
			{ tag: ["@admin", "@admin-panel"] },
			async ({ userInfoAdminPage }) => {
				const userId = userIds[role];

				await userInfoAdminPage.navigate();
				await userInfoAdminPage
					.assertThat()
					.searchBySteam64orUserIdElementsDisplayed();

				await userInfoAdminPage.searchForSteam64OrUserId(userId);

				await userInfoAdminPage.assertThat().isBadgeDisplayed(role);
			},
		);
	});
});
