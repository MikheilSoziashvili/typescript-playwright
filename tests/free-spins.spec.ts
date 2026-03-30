import {
	buildFreeSpinsRevokeNotificationDescription,
	buildSendingOutFreeSpinsToastSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	setAuthenticationCookies,
	stripAuthFromExternalRequests,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { DialogInput } from "@enums/admin/dialog-input";
import { CasinoGameName } from "@enums/casino-game";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { HomePage } from "@pages/home-page/home-page";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

test.describe("Free spins tests", () => {
	test.describe(
		"Grant free spins",
		testDetails().withTags(JiraComponent.REWARDS).apply(),
		() => {
			const freeSpinsTestDataDomain = testData().fromDomain().freeSpins;

			test.use(
				storageStateNewSuperAdminUserDB({
					amount: SUPER_HIGH_USER_AMOUNT,
				}),
			);
			test(
				"[ENG-932] Granting free spins",
				testDetails()
					.withTags(JiraComponent.FREE_SPINS, TestTag.ACCEPTANCE)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ freeSpinsAdminPage, toast, gamdomApiDbFacade }) => {
					const [newUserData] = await gamdomApiDbFacade.createUsersDb(
						{
							usersCount: 1,
						},
					);
					const newUserId = newUserData.userId;
					await freeSpinsAdminPage.navigate();

					await freeSpinsAdminPage.steps().getFreeSpins({
						userId: newUserId,
						gameName: CasinoGameName.BOOK_OF_ARABIA,
						betAmount: 100,
					});

					await toast.assertThat().titlesAre([
						{
							title: ToastTitle.SUCCESS,
							subTitle:
								buildSendingOutFreeSpinsToastSubTitle(
									newUserId,
								),
						},
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.CASINO_REWARD_GIVEN,
						},
					]);
				},
			);

			freeSpinsTestDataDomain.batchScenarios.forEach(
				({ description, filePath, assertions }) => {
					test(
						`[ENG-5008] Granting free spins in batch - ${description}`,
						testDetails()
							.withTags(JiraComponent.FREE_SPINS, TestTag.ACCEPTANCE)
							.withAuthor(JiraUser.RALUCA_ARITON)
							.apply(),
						async ({ freeSpinsAdminPage }) => {
							await freeSpinsAdminPage.navigate();
							await freeSpinsAdminPage
								.steps()
								.uploadBatchFreeSpinsFile(filePath);
							await freeSpinsAdminPage.steps().getFreeSpins({
								gameName: CasinoGameName.BOOK_OF_ARABIA,
								betAmount: 100,
							});
							await assertions(freeSpinsAdminPage);
						},
					);
				},
			);
		},
	);

	test.describe(
		"Free spins claim tests",
		testDetails()
			.withTags(JiraComponent.REWARDS, JiraComponent.FREE_SPINS)
			.apply(),
		() => {
			test.use(
				storageStateNewSuperAdminUserDB({
					amount: SUPER_HIGH_USER_AMOUNT,
				}),
			);
			test(
				"[ENG-4850] Free spins notification - Play button redirects user to game (via UI)",
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browser, gamdomApi, gamdomDb, testDataObject }) => {
					const userData = testDataObject.register.random();
					const superAdminData = new RegisterTestData({
						useGamdomEmailDomain: true,
					});

					await gamdomDb.createNewUser({
						username: userData.username,
						password: userData.password,
						email: userData.email,
					});
					const userCookie =
						await gamdomApi.authenticateWithExistingUser(
							userData.username,
							userData.password,
						);
					const userContext = await browser.newContext();
					const userPage = await userContext.newPage();
					await setAuthenticationCookies(userPage, userCookie);
					const userHomePage = new HomePage(userPage);
					await userHomePage.navigate();

					await gamdomDb.createNewUser({
						username: superAdminData.username,
						password: superAdminData.password,
						tags: UserTags.SuperAdmin,
						userClass: UserClasses.Admin,
						email: superAdminData.email,
					});
					const superAdminCookie =
						await gamdomApi.authenticateWithExistingUser(
							superAdminData.username,
							superAdminData.password,
						);
					const superAdminContext = await browser.newContext();
					const superAdminPage = await superAdminContext.newPage();
					await setAuthenticationCookies(
						superAdminPage,
						superAdminCookie,
					);
					const freeSpinsAdminPage = new FreeSpinsAdminPage(
						superAdminPage,
					);
					await freeSpinsAdminPage.navigate();

					const userId = (
						await gamdomApi.getBasicInfo(
							userData.username,
							userData.password,
						)
					).user.id;

					await freeSpinsAdminPage.steps().getFreeSpins({
						userId: userId,
						gameName: CasinoGameName.BOOK_OF_ARABIA,
						betAmount: 1,
					});
					await userHomePage
						.getNotification()
						.assertThat()
						.isDisplayed();
					await userHomePage.clickPlayFromFreeSpinsNotification();
					await userHomePage.assertThat().userIsRedirectedToGame();
				},
			);
		},
	);

	test.describe(
		"Free spins cannot be sent",
		testDetails().withTags(JiraComponent.FREE_SPINS).apply(),
		() => {
			test.use(
				storageStateNewUserDB({
					amount: 0,
					tags: UserTags.FreeSpinsAdmin,
					userClass: UserClasses.Admin,
				}),
			);
			test(
				"[ENG-3474] Verify free spins cannot be sent when admin wallet is 0",
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ freeSpinsAdminPage, toast, gamdomApiDbFacade }) => {
					const [newUserData] = await gamdomApiDbFacade.createUsersDb(
						{
							usersCount: 1,
						},
					);
					const newUserId = newUserData.userId;
					await freeSpinsAdminPage.navigate();

					await freeSpinsAdminPage.steps().getFreeSpins({
						userId: newUserId,
						gameName: CasinoGameName.BOOK_OF_ARABIA,
						betAmount: 200,
					});

					await toast.assertThat().titlesAre([
						{
							title: ToastTitle.SUCCESS,
							subTitle:
								buildSendingOutFreeSpinsToastSubTitle(
									newUserId,
								),
						},
						{
							title: ToastTitle.FAILED,
							subTitle: ToastSubTitle.BALANCE_TOO_LOW,
						},
					]);
				},
			);
		},
	);

	test.describe(
		"Top played slots tests",
		testDetails()
			.withTags(JiraComponent.FREE_SPINS)
			.withJiraBugTickets("11715")
			.apply(),
		() => {
			test(
				"[ENG-4860] Verify that the TOP PLAYED SLOTS table is displayed only after the GET button from the Get top played slots panel is clicked",
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					freeSpinsAdminPage,
					gamdomApiDbFacade,
					page,
					casinoPage,
					bookOfPyramidsPage,
					homePage,
				}) => {
					await stripAuthFromExternalRequests(page);
					const { user, cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();

					const { cookie: superAdminCookie } =
						await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();

					await setAuthenticationCookies(page, cookie);
					await casinoPage.navigate();
					await casinoPage
						.steps()
						.searchForGameAndOpen(CasinoGameName.BOOK_OF_PYRAMIDS);
					await bookOfPyramidsPage.steps().spinOnceAndGetResult();

					await homePage.navigate({
						cookies: { clearCookies: true },
					});
					await setAuthenticationCookies(page, superAdminCookie);
					await freeSpinsAdminPage.navigate();
					await freeSpinsAdminPage.fillGetTopPlayedSlotsUserId(
						user.userId,
					);

					await freeSpinsAdminPage
						.assertThat()
						.topPlayedSlotsContainerIsNotDisplayed();
					await freeSpinsAdminPage.clickGetTopPlayedSlotsButton();

					await freeSpinsAdminPage
						.assertThat()
						.verifyTopPlayedSlotsTableShowsCorrectGameAndRowCount(
							1,
							CasinoGameName.BOOK_OF_PYRAMIDS,
						);
				},
			);
		},
	);
});

test.describe(
	"Free spins - Revoke Free spins",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.FREE_SPINS)
		.apply(),
	() => {
		const predefinedData = testData().fromPredefined().data;
		const notificationTitle =
			predefinedData.notifications.freeSpinsRevoke.title;
		const notificationDescription =
			buildFreeSpinsRevokeNotificationDescription(
				CasinoGameName.BOOK_OF_ARABIA,
				DialogInput.REVOKE_FREE_SPINS_REASON,
			);

		test(
			"[ENG-2866] Revoke Free spins and verify user notification",
			testDetails()
				.withTags(JiraComponent.FREE_SPINS, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ browserSessionManager }) => {
				const superAdmin = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const userId = regularUser.getAuthenticatedUser().user.userId;

				await regularUser.pages.homePage.navigate();

				await superAdmin.pages.freeSpinsAdminPage.navigate();
				await superAdmin.pages.freeSpinsAdminPage.steps().getFreeSpins({
					userId: userId,
					gameName: CasinoGameName.BOOK_OF_ARABIA,
					betAmount: 1,
				});

				await regularUser.pages.homePage
					.getNotification()
					.assertThat()
					.isDisplayed();

				await superAdmin.pages.freeSpinsAdminPage.getActivatedFreeSpins();
				await superAdmin.pages.freeSpinsAdminPage.revokeFreeSpins();
				await superAdmin.pages.toast
					.assertThat()
					.titleIs(ToastTitle.SUCCESS, {
						subTitle: ToastSubTitle.FREE_SPINS_REVOKED,
					});

				await superAdmin.pages.freeSpinsAdminPage.getActivatedFreeSpins();
				await superAdmin.pages.freeSpinsAdminPage
					.assertThat()
					.freeSpinsAreRevoked();

				await regularUser.pages.notificationsPage.navigate();
				await regularUser.pages.notificationsPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						notificationTitle,
						notificationDescription,
					);
			},
		);
	},
);
