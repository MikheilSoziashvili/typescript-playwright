import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { JiraUser } from "@enums/jira/jira-users";
import { UserMenuOption } from "@enums/user-menu-options";
import { test } from "@fixtures/fixtures";
import { ProfilePage } from "@pages/profile/profile-page";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

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

test.describe("User profile links accessibility", () => {
	test.describe("User profile - user avatar dropdown - verification page test", () => {
		testData()
			.fromCsvRaw({
				file: CsvFilesName.KYC_USERS_LEVEL_VERIFICATION_PAGE,
			})
			.forEach((kycLevelData) => {
				test(
					`[ENG-5988] Open "Verification" from the User Profile dropdown for user with aml ${kycLevelData.kycLevel}`,
					testDetails()
						.withTags(JiraComponent.PROFILE, JiraComponent.VERIFICATION, TestTag.ACCEPTANCE)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						gamdomApiDbFacade,
						gamdomApi,
						homePage,
						verificationPage,
						page,
					}) => {
						const [userData] =
							await gamdomApiDbFacade.createUsersWithAmlLevelsDb({
								users: [
									{
										level: AmlVerificationLevel[
											kycLevelData.kycLevel as keyof typeof AmlVerificationLevel
										],
									},
								],
							});
						const cookie =
							await gamdomApi.authenticateWithExistingUser(
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
							.verificationPageTitleAndTabsAreVisible();
					},
				);
			});
	});

	test.describe("User Profile items links accessibility tests", () => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.USER_PROFILE_ITEMS_LINKS_ACCESSIBILITY,
			})
			.forEach((menuItem) => {
				testDataInput.forEach(
					({ testId, menuType, navigationMethod }) => {
						test(
							`[${testId}] Verify '${menuItem.menuItemLink}' User Profile ${menuType} link item accessibility for user with aml ${menuItem.userKycLevel}`,
							testDetails()
								.withTags(JiraComponent.PROFILE, TestTag.ACCEPTANCE)
								.withAuthor(JiraUser.IVAYLO_STOYCHEV)
								.apply(),
							async ({
								gamdomApiDbFacade,
								gamdomApi,
								profilePage,
								page,
							}) => {
								const [userData] =
									await gamdomApiDbFacade.createUsersWithAmlLevelsDb(
										{
											users: [
												{
													level: AmlVerificationLevel[
														menuItem.userKycLevel as keyof typeof AmlVerificationLevel
													],
												},
											],
										},
									);

								const cookie =
									await gamdomApi.authenticateWithExistingUser(
										userData.username,
										userData.password,
									);
								await setAuthenticationCookies(page, cookie);
								await profilePage.navigate();

								await navigationMethod(
									profilePage,
									menuItem.menuItemLink,
								);

								await profilePage
									.assertThat()
									.verifyLinksAreAccessible([
										menuItem.expectedUrl,
									]);
								await profilePage
									.assertThat()
									.waitForAndVerifyCurrentUrlIs(
										menuItem.expectedUrl,
									);
							},
						);
					},
				);
			});
	});
});
