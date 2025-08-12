import { BATCH_FREE_SPINS_FILE_PATH } from "@constants/file-paths";
import { setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CasinoGameName } from "@enums/casino-game";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
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
import { USER_1_ID } from "database/constants/user-ids";

test.describe("Free spins tests", () => {
	test.describe("Grant free spins", { tag: ["@rewards"] }, () => {
		test.use(
			storageStateNewSuperAdminUserDB({ amount: SUPER_HIGH_USER_AMOUNT }),
		);
		test(
			"[ENG-932] Granting free spins",
			{ tag: ["@free-spins"] },
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
			{ tag: ["@spins"] },
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
	});

	test.describe(
		"Free spins claim tests",
		{ tag: ["@rewards", "@spins"] },
		() => {
			test.use(
				storageStateNewSuperAdminUserDB({
					amount: SUPER_HIGH_USER_AMOUNT,
				}),
			);
			test("[ENG-4850] Free spins notification - Play button redirects user to game (via UI)", async ({
				browser,
				gamdomApi,
				gamdomDb,
			}) => {
				const userData = new RegisterTestData();
				const superAdminData = new RegisterTestData({
					useGamdomEmailDomain: true,
				});

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
				await userHomePage.getNotification().assertThat().isDisplayed();
				await userHomePage.clickPlayFromFreeSpinsNotification();
				await userHomePage.assertThat().userIsRedirectedToGame();
			});
		},
	);

	test.describe("Free spins cannot be sent", { tag: ["@free-spins"] }, () => {
		test.use(
			storageStateNewUserDB({
				amount: 0,
				tags: UserTags.FreeSpinsAdmin,
				userClass: UserClasses.Admin,
			}),
		);
		test("[ENG-3474] Verify free spins cannot be sent when admin wallet is 0", async ({
			freeSpinsAdminPage,
			toast,
		}) => {
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
		});
	});
});
