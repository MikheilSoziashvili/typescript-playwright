import { DATASETS_DIR } from "@constants/file-paths";
import { delayRoute } from "@core/helpers/network-helpers";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	parse_csv,
	parseExpectedAdditionalFields,
	parseExpectedTags,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { BalanceEditStep } from "@dtos/test-data";
import { UserInfoEditInfoFields } from "@enums/admin/user-info-edit-info-fields";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ApiEndpoints } from "@enums/api-endpoints";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";

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
	additionalFields: string;
}[];

test.describe(
	"User info - edit tests",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		test.describe("Edit Info - Verify tags selection", () => {
			test.beforeEach(async ({ page, gamdomApiDbFacade }) => {
				const { cookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();

				await setAuthenticationCookies(page, cookie);
			});

			staffRoleDataset.forEach((record) => {
				test(
					`[ENG-5543] Edit Info - Selecting '${record.staffRoleTag}' checks its related tags`,
					testDetails()
						.withTags(TestTag.PLATFORM_BUG)
						.withJiraBugTickets("8283")
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({
						userInfoAdminPage,
						gamdomDb,
						userInfoEditInfoAdminPage,
						toast,
						testDataObject,
					}) => {
						test.fixme(isScheduledRun);
						const superAdminUserData =
							testDataObject.register.random();
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
				const __adminRoles = recordVisibility.adminStaffRole.split(
					"|",
				) as (keyof typeof UserTags)[];
				const __adminTags = __adminRoles.map((role) => UserTags[role]);

				test.use(
					storageStateNewUserDB({
						userClass: UserClasses.Admin,
						tags: __adminTags,
					}),
				);

				test(
					`[ENG-5552] Admin with '${recordVisibility.adminStaffRole}' can see assigned tags`,
					testDetails()
						.withTags(JiraComponent.EDIT_INFO)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({
						userInfoAdminPage,
						userInfoEditInfoAdminPage,
						gamdomApiDbFacade,
						gamdomDb,
					}) => {
						const [user] = await gamdomApiDbFacade.createUsersDb({
							usersCount: 1,
							emailVerified: true,
							userClass: UserClasses.User,
						});

						const cryptoUnits: Unit[] = Object.values(Unit);

						await gamdomApiDbFacade.upsertUserWalletsDb(
							user.userId,
							cryptoUnits,
							SUPER_HIGH_USER_AMOUNT,
						);

						await gamdomDb.insertUserVaultWallet(user.userId);

						const expectedTags = parseExpectedTags(
							recordVisibility.userTags,
						);
						const expectedAdditionalFields =
							parseExpectedAdditionalFields(
								recordVisibility.additionalFields,
							);

						await userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(user.username);
						await userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.EditInfo,
						);
						await userInfoEditInfoAdminPage
							.assertThat()
							.verifyTagsAreVisible(expectedTags);

						await userInfoEditInfoAdminPage
							.assertThat()
							.verifyAdditionalFieldsAreVisible(
								expectedAdditionalFields,
							);
					},
				);
			});
		});

		test.describe(
			"Edit info - Verify Edit Balance",
			testDetails().withTags(JiraComponent.EDIT_INFO).apply(),
			() => {
				test.beforeEach(async ({ page, gamdomApiDbFacade }) => {
					const { cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							tags: UserTags.SupportStaff,
							userClass: UserClasses.Admin,
						});

					await setAuthenticationCookies(page, cookie);
				});

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

				test(
					"[ENG-6392] Edit info - wager_req_end flow",
					testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
					async ({
						userInfoAdminPage,
						userInfoEditInfoAdminPage,
						toast,
						page,
						gamdomApiDbFacade,
					}) => {
						const { user } =
							await gamdomApiDbFacade.createUserWithWalletsAndAuth(
								{
									walletUnits: walletUnits,
									amount: SUPER_HIGH_USER_AMOUNT,
								},
							);

						await userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(user.username);
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
								gamdomApiDbFacade,
							}) => {
								const { user } =
									await gamdomApiDbFacade.createUserWithWalletsAndAuth(
										{
											walletUnits: walletUnits,
											amount: SUPER_HIGH_USER_AMOUNT,
										},
									);

								await userInfoAdminPage
									.steps()
									.navigateAndShowUserDetails(user.username);
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

		test.describe("Edit info - Verify Save button", () => {
			test(
				`[ENG-7558] UserInfo - EditInfo tab - verify Save button states`,
				testDetails()
					.withTags(JiraComponent.EDIT_INFO)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({
					gamdomApiDbFacade,
					userInfoAdminPage,
					userInfoEditInfoAdminPage,
				}) => {
					const { cookie: superAdminCookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							userClass: UserClasses.Admin,
							tags: UserTags.SupportStaff,
						});

					await setAuthenticationCookies(
						userInfoAdminPage.page,
						superAdminCookie,
					);

					const [user] = await gamdomApiDbFacade.createUsersDb({
						usersCount: 1,
					});

					await userInfoAdminPage.navigate();
					await userInfoAdminPage.searchForSteam64OrUserId(
						user.userId,
					);
					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.EditInfo,
					);

					const throttleEditInfo = delayRoute(
						ApiEndpoints.EDIT_USER_INFO,
						Timeout.ULTRA_SHORT,
					);

					await throttleEditInfo(userInfoEditInfoAdminPage.page);
					await userInfoEditInfoAdminPage
						.assertThat()
						.clickSaveAndAssertTransitionToSaving();
					await userInfoEditInfoAdminPage
						.assertThat()
						.saveButtonIsEnabledWithSaveText();
				},
			);
		});

		test.describe("Edit info - e-sports player category", () => {
			testData()
				.fromCsvRaw({
					file: CsvFilesName.ESPORTS_CATEGORIES,
				})
				.forEach((eSportCategory) => {
					test(
						`[ENG-6324] - UserInfo - EditInfo tab - verify assignment of ${eSportCategory.userCategory} eSports category to user`,
						testDetails()
							.withTags(TestTag.PLATFORM_BUG)
							.withJiraBugTickets("8283")
							.withTags(JiraComponent.EDIT_INFO)
							.withAuthor(JiraUser.RALUCA_ARITON)
							.apply(),
						async ({
							gamdomApiDbFacade,
							browserSessionManager,
							userAuditLogListener,
						}) => {
							test.fixme(isScheduledRun);
							const [regularUserData] =
								await gamdomApiDbFacade.createUsersDb({
									usersCount: 1,
								});

							const superAdmin =
								await browserSessionManager.loginAs(
									TestUserRole.SUPERADMIN,
									{ reuseContext: true },
								);

							await superAdmin.pages.userInfoAdminPage
								.steps()
								.navigateAndShowUserDetails(
									regularUserData.username,
								);
							await superAdmin.pages.userInfoAdminPage.clickUserInfoTab(
								UserInfoTabs.EditInfo,
							);

							const toastText =
								await superAdmin.pages.userInfoEditInfoAdminPage
									.steps()
									.selectAndSaveEsportsCategoryAndGetToastMessage(
										eSportCategory.userCategory,
									);

							const toastResult =
								await superAdmin.pages.userInfoEditInfoAdminPage
									.assertThat()
									.assertEsportsCategoryToast(
										eSportCategory.userCategory,
										toastText,
									);

							await superAdmin.pages.userInfoAdminPage.clickUserInfoTab(
								UserInfoTabs.Transactions,
							);

							userAuditLogListener.startListening();

							await superAdmin.pages.transactionsAdminPage.clickFetchData();

							const auditResponse =
								await userAuditLogListener.getLatestAuditLog();

							await superAdmin.pages.transactionsAdminPage
								.assertThat()
								.esportsCategoryAuditLog(
									auditResponse,
									eSportCategory.userCategory,
									regularUserData.userId,
									toastResult,
								);
						},
					);
				});
		});

		testData()
			.fromCsvRaw({
				file: CsvFilesName.UNWAGERED_DEPOSITS_FIELD,
			})
			.forEach((input) => {
				test(
					`[ENG-11731] Edit Info - Verify unwagered_deposits field with ${input.staffRoleTag} account`,
					testDetails()
						.withTags(JiraComponent.EDIT_INFO)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						browserSessionManager,
						gamdomApiDbFacade,
						userInfoEditInfoAdminPage,
						toast,
						page,
						testDataPredefined,
						userInfoStaffUserSetupFlow,
						userInfoEditFieldFlow,
					}) => {
						test.fixme(
							input.staffRoleTag === UserTags.SuperAdmin,
							"OBT servers are disabled after working hours due to OBT team rule and we can not test them in nightly runs.",
						);
						const { validValue, invalidValue } =
							testDataPredefined.data.userInfoEditInfo
								.unwageredDeposits;

						await userInfoStaffUserSetupFlow.setupStaffUserAndNavigateToEditInfo(
							{
								browserSessionManager: browserSessionManager,
								gamdomApiDbFacade: gamdomApiDbFacade,
								staffTag: input.staffRoleTag,
							},
						);

						await userInfoEditFieldFlow.editFieldAndVerifyToasts({
							userInfoEditInfoAdminPage:
								userInfoEditInfoAdminPage,
							toast: toast.assertThat(),
							page: page,
							fieldName:
								UserInfoEditInfoFields.UNWAGERED_DEPOSITS,
							validValue: validValue,
							invalidValue: invalidValue,
							expectedErrorMessage:
								ToastSubTitle.INVALID_UNWAGERED_DEPOSIT_VALUE,
						});
					},
				);
			});
	},
);
