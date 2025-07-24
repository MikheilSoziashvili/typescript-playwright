import { RegisterTestData } from "@dtos/test-data";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { ToastTitle } from "@enums/toast-titles";

interface StaffRoleCsvRecord {
	staffRoleTag: keyof typeof UserTags;
	tags1: string;
	tags2: string;
}

const staffRoleDataset = parse_csv(
	DATASETS_DIR,
	CsvFilesName.STAFF_ROLE_TAGS,
) as StaffRoleCsvRecord[];

const staffRoleVisibilityDataset = parse_csv(
	DATASETS_DIR,
	CsvFilesName.STAFF_ROLE_TAGS_VISIBILITY,
) as {
	adminStaffRole: string;
	userTags: string;
}[];

test.describe(
	"User info - edit tests",
	{
		tag: ["@admin-panel, @user-info"],
	},
	() => {
		test.describe("Edit Info - Verify tags selection", () => {
			test.use(storageStateNewSuperAdminUserDB());

			staffRoleDataset.forEach((record) => {
				test(`[ENG-5543] Edit Info - Selecting '${record.staffRoleTag}' checks its related tags`, async ({
					userInfoAdminPage,
					gamdomDb,
					userInfoEditInfoAdminPage,
					toast,
				}) => {
					const superAdminUserData = new RegisterTestData();
					await gamdomDb.createNewUser({
						username: superAdminUserData.username,
						password: superAdminUserData.password,
						email: superAdminUserData.email,
						emailVerified: true,
						userClass: UserClasses.Admin,
					});

					const tagSources = [record.tags1, record.tags2];
					const expectedTags = tagSources.flatMap((tags) =>
						tags
							.split(",")
							.map((t) => t.trim())
							.map((t) => {
								const tag =
									UserTags[t as keyof typeof UserTags];
								return tag;
							}),
					);

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(
							superAdminUserData.username,
						);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.EditInfo,
					);
					await userInfoEditInfoAdminPage.toggleTag(
						UserTags[record.staffRoleTag],
					);
					await userInfoEditInfoAdminPage
						.assertThat()
						.verifyTagsAreChecked(expectedTags, true);
					await userInfoEditInfoAdminPage.clickSaveButton();
					await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				});
			});
		});

		staffRoleVisibilityDataset.forEach((recordVisibility) => {
			test.describe(`Edit Info - Tag visibility for role: ${recordVisibility.adminStaffRole}`, () => {
				test.use(
					storageStateNewUserDB({
						userClass: UserClasses.Admin,
						tags: UserTags[
							recordVisibility.adminStaffRole as keyof typeof UserTags
						],
					}),
				);

				test(`[ENG-5552] Admin with '${recordVisibility.adminStaffRole}' can see assigned tags`, async ({
					userInfoAdminPage,
					gamdomDb,
					userInfoEditInfoAdminPage,
				}) => {
					const newUserData = new RegisterTestData();
					await gamdomDb.createNewUser({
						username: newUserData.username,
						password: newUserData.password,
						email: newUserData.email,
						emailVerified: true,
						userClass: UserClasses.User,
					});

					const expectedTags = recordVisibility.userTags
						.split(",")
						.map((t) => t.trim())
						.map((t) => {
							const tag = UserTags[t as keyof typeof UserTags];
							return tag;
						});

					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(newUserData.username);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.EditInfo,
					);
					await userInfoEditInfoAdminPage
						.assertThat()
						.verifyTagsAreVisible(expectedTags);
				});
			});
		});
	},
);
