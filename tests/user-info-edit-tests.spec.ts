import { RegisterTestData } from "@dtos/test-data";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
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

test.describe("User info - edit tests", () => {
	test.use(storageStateNewSuperAdminUserDB());

	staffRoleDataset.forEach((record) => {
		test(`[ENG-5543] Edit Info - Verify that selecting a Staff Role tag checks the corresponding specific tags "${record.staffRoleTag}`, async ({
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
					.map((t) => UserTags[t as keyof typeof UserTags]),
			);

			await userInfoAdminPage
				.steps()
				.navigateAndShowUserDetails(superAdminUserData.username);
			await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.EditInfo);
			await userInfoEditInfoAdminPage.toggleTag(
				UserTags[record.staffRoleTag],
			);
			await userInfoEditInfoAdminPage
				.assertThat()
				.assertTagsChecked(expectedTags, true);

			await userInfoEditInfoAdminPage.clickSaveButton();
			await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		});
	});
});
