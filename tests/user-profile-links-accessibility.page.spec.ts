import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv, setAuthenticationCookies } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { UserMenuOption } from "@enums/user-menu-options";
import { test } from "@fixtures/fixtures";
import { ProfilePage } from "@pages/profile/profile-page";

const testDataInput = [
	{
		testId: "ENG-6451",
		menuType: "dropdown",
		navigationMethod: async (
			profilePage: ProfilePage,
			menuItem: UserMenuOption,
		) => {
			await profilePage.authenticatedHeader.navigateToUserMenuOption(
				menuItem,
			);
		},
	},
	{
		testId: "ENG-6452",
		menuType: "left menu",
		navigationMethod: async (
			profilePage: ProfilePage,
			menuItem: UserMenuOption,
		) => {
			await profilePage.navigateToUserMenuOption(menuItem);
		},
	},
];

const menuItems = parse_csv(
	DATASETS_DIR,
	CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY,
) as {
	menuItemLink: UserMenuOption;
	userKycLevel: string;
	expectedUrl: string;
}[];

const kycLevelsData = parse_csv(
	DATASETS_DIR,
	CsvFilesName.KYC_USERS_LEVEL_VERIFICATION_PAGE,
) as {
	kycLevel: string;
	verificationPageURL: string;
}[];

test.describe("User profile links accessibility", () => {
	const levelUserData = Array(3)
		.fill(null)
		.map(() => new RegisterTestData());
	const [level1UserData, level2UserData, level3UserData] = levelUserData;

	test.beforeAll(async ({ gamdomApi, gamdomDb }) => {
		const userData = [level1UserData, level2UserData, level3UserData];
		const levels = [
			AmlVerificationLevel.Level1,
			AmlVerificationLevel.Level2,
			AmlVerificationLevel.Level3,
		];

		await Promise.all(
			userData.map((user) =>
				gamdomDb.createNewUser({
					username: user.username,
					password: user.password,
					email: user.email,
					emailVerified: true,
				}),
			),
		);

		for (let i = 0; i < userData.length; i++) {
			const userId = (
				await gamdomApi.getBasicInfo(
					userData[i].username,
					userData[i].password,
				)
			).user.id;

			await gamdomDb.updateUserEmailVerification(userId);
			await gamdomDb.insertDefaultAmlStatusByLevel(userId, levels[i]);
		}
	});

	const userDataByLevel = {
		Level1: level1UserData,
		Level2: level2UserData,
		Level3: level3UserData,
	};

	test.describe("User profile - user avatar dropdown - verification page test", () => {
		kycLevelsData.forEach((kycLevelData) => {
			test(`[ENG-5988] Open "Verification" from the User Profile dropdown for user with aml ${kycLevelData.kycLevel}`, async ({
				gamdomApi,
				homePage,
				verificationPage,
				page,
			}) => {
				const userData =
					userDataByLevel[
						kycLevelData.kycLevel as keyof typeof userDataByLevel
					];
				const cookie = await gamdomApi.authenticateWithExistingUser(
					userData.username,
					userData.password,
				);
				await setAuthenticationCookies(page, cookie);
				await homePage.navigate();
				await homePage.authenticatedHeader.navigateToUserMenuOption(
					UserMenuOption.VERIFICATION,
				);
				await verificationPage
					.assertThat()
					.verifyLinksAreAccessible([
						kycLevelData.verificationPageURL,
					]);
				await verificationPage
					.assertThat()
					.waitForAndVerifyCurrentUrlIs(
						kycLevelData.verificationPageURL,
					);
				await verificationPage
					.assertThat()
					.verificationPageTitleIsVisible();
			});
		});
	});

	test.describe("User Profile items links accessibility tests", () => {
		menuItems.forEach((menuItem) => {
			testDataInput.forEach(({ testId, menuType, navigationMethod }) => {
				test(`[${testId}] Verify '${menuItem.menuItemLink}' User Profile ${menuType} link item accessibility for user with aml ${menuItem.userKycLevel}`, async ({
					gamdomApi,
					profilePage,
					page,
				}) => {
					const userData =
						userDataByLevel[
							menuItem.userKycLevel as keyof typeof userDataByLevel
						];
					const cookie = await gamdomApi.authenticateWithExistingUser(
						userData.username,
						userData.password,
					);
					await setAuthenticationCookies(page, cookie);
					await profilePage.navigate();

					await navigationMethod(profilePage, menuItem.menuItemLink);

					await profilePage
						.assertThat()
						.verifyLinksAreAccessible([menuItem.expectedUrl]);
					await profilePage
						.assertThat()
						.waitForAndVerifyCurrentUrlIs(menuItem.expectedUrl);
				});
			});
		});
	});
});
