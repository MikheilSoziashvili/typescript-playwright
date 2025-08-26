import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { testDetails } from "@core/helpers/test-details-helper";
import { BalanceEditStep, RegisterTestData } from "@dtos/test-data";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";
import { JiraUser } from "@enums/jira/jira-users";

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
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		test.describe("Edit Info - Verify tags selection", () => {
			test.use(storageStateNewSuperAdminUserDB());

			staffRoleDataset.forEach((record) => {
				test(
					`[ENG-5543] Edit Info - Selecting '${record.staffRoleTag}' checks its related tags`,
					testDetails()
						.withJiraBugTickets("8283")
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({
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
					},
				);
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

				test(
					`[ENG-5552] Admin with '${recordVisibility.adminStaffRole}' can see assigned tags`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({
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
								const tag =
									UserTags[t as keyof typeof UserTags];
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
					},
				);
			});
		});

		test.describe(
			"Edit info - Verify Edit Balance",
			testDetails().withTags(JiraComponent.EDIT_INFO).apply(),
			() => {
				test.use(
					storageStateNewUserDB({
						userClass: UserClasses.Admin,
						tags: UserTags.SupportStaff,
					}),
				);

				const newUserData = new RegisterTestData();
				const walletUnits = Object.values(Unit);

				const wagerEditSteps: BalanceEditStep[] = [
					{
						name: "Save without changes",
						action: async (_pageObj, _wallet, _page) => {
							await Promise.resolve();
						},
						expectedTitle: ToastTitle.FAILED,
						expectedMsg: ToastSubTitle.NO_CHANGES_WERE_MADE,
					},
					{
						name: "Increase wager_req_end",
						action: async (pageObj, _wallet, _page) =>
							pageObj
								.steps()
								.adjustValueByLabel("wager_req_end", +1),
						expectedTitle: ToastTitle.SUCCESS,
						expectedMsg: ToastSubTitle.SUCCESSFUL_EDIT,
					},
					{
						name: "Decrease wager_req_end",
						action: async (pageObj, _wallet, _page) =>
							pageObj
								.steps()
								.adjustValueByLabel("wager_req_end", -1),
						expectedTitle: ToastTitle.SUCCESS,
						expectedMsg: ToastSubTitle.SUCCESSFUL_EDIT,
					},
				];

				const walletEditSteps: BalanceEditStep[] = [
					{
						name: "Increase $1 of wallet",
						action: async (pageObj, wallet, _page) =>
							pageObj.steps().adjustValueByLabel(wallet, +1),
						expectedTitle: ToastTitle.FAILED,
						expectedMsg: ToastSubTitle.ONLY_DECREASE_WALLET_AMOUNT,
					},
					{
						name: "Refresh & decrease $1 of wallet",
						action: async (pageObj, wallet, page) => {
							await page.reload();
							await pageObj
								.steps()
								.adjustValueByLabel(wallet, -1);
						},
						expectedTitle: ToastTitle.SUCCESS,
						expectedMsg: ToastSubTitle.SUCCESSFUL_EDIT,
					},
				];

				test.beforeAll(async ({ gamdomApi, gamdomDb }) => {
					await gamdomDb.createNewUser({
						username: newUserData.username,
						password: newUserData.password,
						email: newUserData.email,
					});
					const userId = (
						await gamdomApi.getBasicInfo(
							newUserData.username,
							newUserData.password,
						)
					).user.id;

					await Promise.all(
						walletUnits.map((unit) =>
							gamdomDb.upsertUserWallet(
								userId,
								unit,
								SUPER_HIGH_USER_AMOUNT,
							),
						),
					);
				});

				test(
					"[ENG-6392] Edit info - wager_req_end flow",
					testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
					async ({
						userInfoAdminPage,
						userInfoEditInfoAdminPage,
						toast,
						page,
					}) => {
						await userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(newUserData.username);
						await userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.EditInfo,
						);

						await userInfoEditInfoAdminPage
							.steps()
							.runEditSteps(
								wagerEditSteps,
								"",
								page,
								toast.assertThat(),
							);
					},
				);

				testData()
					.fromCsvRaw({
						file: CsvFilesName.EDIT_INFO_ADJUSTING_WALLETS,
					})
					.forEach(({ wallet }) => {
						test(
							`[ENG-6392] Edit info - wallet balance flow for ${wallet}`,
							testDetails()
								.withAuthor(JiraUser.RALUCA_ARITON)
								.apply(),
							async ({
								userInfoAdminPage,
								userInfoEditInfoAdminPage,
								toast,
								page,
							}) => {
								await userInfoAdminPage
									.steps()
									.navigateAndShowUserDetails(
										newUserData.username,
									);
								await userInfoAdminPage.clickUserInfoTab(
									UserInfoTabs.EditInfo,
								);

								await userInfoEditInfoAdminPage
									.steps()
									.runEditSteps(
										walletEditSteps,
										wallet,
										page,
										toast.assertThat(),
									);
							},
						);
					});
			},
		);
	},
);
