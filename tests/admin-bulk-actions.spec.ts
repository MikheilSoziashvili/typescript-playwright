import { BULK_TIP_FILE_PATH } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { buildCsvFromTemplate } from "@core/utils/csv-utils/csv-generator-utils";
import { computeBulkTipExpectations } from "@core/utils/bulk-tip-utils";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TipReason } from "@enums/tip-reasons";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { TransactionType } from "@enums/transaction-types";
import { test } from "@fixtures/fixtures";
import { NotificationsPage } from "@pages/notifications/notifications-page";

test.describe(
	"Bulk Actions - Notifications",
	testDetails().withTags(JiraComponent.ADMIN).apply(),
	() => {
		test(
			`[ENG-7577] Check the bulk upload functionality for sending notifications`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApiDbFacade,
				bulkActionsAdminPage,
				gamdomApi,
				browser,
			}) => {
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						userClass: UserClasses.Admin,
						tags: UserTags.SuperAdmin,
					});
				await setAuthenticationCookies(
					bulkActionsAdminPage.page,
					cookie,
				);
				const [userOneData, userTwoData] =
					await gamdomApiDbFacade.createUsersDb({
						usersCount: 2,
					});

				const validUserIds = [
					userOneData.userId.toString(),
					userTwoData.userId.toString(),
				];
				const invalidUserIds = ["0", "-1"];
				const allUserIds = [...validUserIds, ...invalidUserIds];

				await bulkActionsAdminPage.navigateAndGoToNotificationsTab();

				const title = generateRandomString({
					prefix: "AutoTestTitle",
					length: 5,
				});
				const description = generateRandomString({
					prefix: "AutoTestDescription",
					length: 10,
				});

				await bulkActionsAdminPage
					.steps()
					.sendNotificationToMultipleUsers(
						allUserIds,
						title,
						description,
					);

				await bulkActionsAdminPage
					.assertThat()
					.successLogsContainUserIds(validUserIds);

				await bulkActionsAdminPage
					.assertThat()
					.errorLogsContainUserIds(invalidUserIds);

				const cookieUserOne =
					await gamdomApi.authenticateWithExistingUser(
						userOneData.username,
						userOneData.password,
					);

				const userOneContext = await browser.newContext();
				const userOnePage = await userOneContext.newPage();

				await setAuthenticationCookies(userOnePage, cookieUserOne);

				const userOneNotificationsPage = new NotificationsPage(
					userOnePage,
				);
				await userOneNotificationsPage.navigate();
				await userOneNotificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);

				const cookieUserTwo =
					await gamdomApi.authenticateWithExistingUser(
						userTwoData.username,
						userTwoData.password,
					);

				const userTwoContext = await browser.newContext();
				const userTwoPage = await userTwoContext.newPage();
				await setAuthenticationCookies(userTwoPage, cookieUserTwo);

				const userTwoNotificationsPage = new NotificationsPage(
					userTwoPage,
				);
				await userTwoNotificationsPage.navigate();
				await userTwoNotificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);
			},
		);
	},
);

test.describe(
	"Bulk Actions - Tip",
	testDetails()
		.withTags(JiraComponent.ADMIN, JiraComponent.TRANSACTIONS)
		.apply(),
	() => {
		test(
			`[ENG-7780] Check the bulk upload functionality for giving tips`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
			async ({
				gamdomApiDbFacade,
				bulkActionsAdminPage,
				toast,
				userInfoAdminPage,
				transactionsAdminPage,
			}) => {
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						userClass: UserClasses.Admin,
						tags: UserTags.SuperAdmin,
					});
				await setAuthenticationCookies(
					bulkActionsAdminPage.page,
					cookie,
				);
				const createdUsers = await gamdomApiDbFacade.createUsersDb({
					usersCount: 4,
				});
				const validUserIds = createdUsers.map((u) =>
					u.userId.toString(),
				);

				const { outAbsPath: csvPath, rows } = buildCsvFromTemplate(
					BULK_TIP_FILE_PATH,
					validUserIds,
				);

				const bulkTipData = computeBulkTipExpectations(
					rows,
					new Set(validUserIds),
				);

				await bulkActionsAdminPage.navigateAndGoToTipTab();
				await bulkActionsAdminPage.bulkTipFileUpload(csvPath);
				await bulkActionsAdminPage.selectTipReason(TipReason.GIVEAWAY);

				await bulkActionsAdminPage.clickProcessTipsButton();

				await toast
					.assertThat()
					.toastMessageIs(
						ToastTitle.SUCCESS,
						ToastSubTitle.TIPS_PROCESSED_SUCCESSFULLY,
					);

				await bulkActionsAdminPage.assertThat().summaryIs({
					totalUsd: bulkTipData.totalUsd,
					totalUsers: bulkTipData.totalUsersAll,
				});

				await bulkActionsAdminPage
					.assertThat()
					.successLogsContainUserIds(bulkTipData.successUserIds);

				await bulkActionsAdminPage
					.assertThat()
					.errorLogsContainUserIds(bulkTipData.errorUserIds);

				for (const { userId, tip } of bulkTipData.expectedValid) {
					await userInfoAdminPage.navigate();
					await userInfoAdminPage.searchForSteam64OrUserId(userId);
					await transactionsAdminPage.navigateToAdminUserTransactionsPage();
					await transactionsAdminPage.clickFetchData();

					await transactionsAdminPage
						.assertThat()
						.hasTransactionWithTypeAndValue(
							TransactionType.TIPS,
							tip,
						);
				}
			},
		);
	},
);
