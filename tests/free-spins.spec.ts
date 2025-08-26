import { BATCH_FREE_SPINS_FILE_PATH } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { DialogInput } from "@enums/admin/dialog-input";
import { CasinoGameName } from "@enums/casino-game";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { HomePage } from "@pages/home-page/home-page";
import { NotificationsPage } from "@pages/notifications/notifications-page";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { USER_1_ID } from "database/constants/user-ids";

test.describe("Free spins tests", () => {
	test.describe(
		"Grant free spins",
		testDetails().withTags(JiraComponent.REWARDS).apply(),
		() => {
			test.use(
				storageStateNewSuperAdminUserDB({
					amount: SUPER_HIGH_USER_AMOUNT,
				}),
			);
			test(
				"[ENG-932] Granting free spins",
				testDetails()
					.withTags(JiraComponent.FREE_SPINS)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ freeSpinsAdminPage, toast }) => {
					await freeSpinsAdminPage.navigate();

					await freeSpinsAdminPage.steps().getFreeSpins({
						userId: USER_1_ID,
						gameName: CasinoGameName.BARREL_BONANZA,
						betAmount: 100,
					});

					await toast.assertThat().titlesAre([
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
						},
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.CASINO_REWARD_GIVEN,
						},
					]);
				},
			);

			test(
				"[ENG-5008] Granting free spins in batch",
				testDetails()
					.withTags(JiraComponent.FREE_SPINS)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ freeSpinsAdminPage, toast }) => {
					await freeSpinsAdminPage.navigate();

					await freeSpinsAdminPage
						.steps()
						.uploadBatchFreeSpinsFile(BATCH_FREE_SPINS_FILE_PATH);

					await freeSpinsAdminPage.steps().getFreeSpins({
						gameName: CasinoGameName.BARREL_BONANZA,
						betAmount: 100,
					});

					await toast.assertThat().titlesAre([
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
						},
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.CASINO_REWARD_GIVEN,
						},
					]);
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
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
				async ({ browser, gamdomApi, gamdomDb }) => {
					const userData = new RegisterTestData();
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
						gameName: CasinoGameName.BARREL_BONANZA,
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
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
				async ({ freeSpinsAdminPage, toast }) => {
					await freeSpinsAdminPage.navigate();

					await freeSpinsAdminPage.steps().getFreeSpins({
						userId: USER_1_ID,
						gameName: CasinoGameName.MYSTIC_CHIEF,
						betAmount: 200,
					});

					await toast.assertThat().titlesAre([
						{
							title: ToastTitle.SUCCESS,
							subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
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
});

test.describe(
	"Free spins - Revoke Free spins",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.FREE_SPINS)
		.apply(),
	() => {
		const title = "Promotion";
		const description = `The free spins promotion for Barrel Bonanza game has revoked. Note: ${DialogInput.REVOKE_FREE_SPINS_REASON}`;

		test.use(storageStateNewSuperAdminUserDB());
		test(
			"[ENG-2866] Revoke Free spins and verify user notification",
			testDetails()
				.withTags(JiraComponent.FREE_SPINS)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({
				browser,
				gamdomApi,
				gamdomDb,
				freeSpinsAdminPage,
				toast,
			}) => {
				const userData = new RegisterTestData();

				await gamdomDb.createNewUser({
					username: userData.username,
					password: userData.password,
					email: userData.email,
				});
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					userData.username,
					userData.password,
				);
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				await freeSpinsAdminPage.navigate();

				const userId = (
					await gamdomApi.getBasicInfo(
						userData.username,
						userData.password,
					)
				).user.id;

				await freeSpinsAdminPage.steps().getFreeSpins({
					userId: userId,
					gameName: CasinoGameName.BARREL_BONANZA,
					betAmount: 1,
				});
				await userHomePage.getNotification().assertThat().isDisplayed();

				await freeSpinsAdminPage.getActivatedFreeSpins();
				await freeSpinsAdminPage.revokeFreeSpins();
				await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
					subTitle: ToastSubTitle.FREE_SPINS_REVOKED,
				});

				await freeSpinsAdminPage.getActivatedFreeSpins();
				await freeSpinsAdminPage.assertThat().freeSpinsAreRevoked();

				const userNotificationPage = new NotificationsPage(userPage);
				await userNotificationPage.navigate();
				await userNotificationPage
					.assertThat()
					.notificationVisibleAndHasTitleAndDescription(
						title,
						description,
					);
			},
		);
	},
);
