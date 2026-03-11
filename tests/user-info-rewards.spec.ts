import { BrowserUserSession } from "@core/browser-session-mngmt";
import { AuthenticatedUser } from "@core/facades/gamdom-api-db/interfaces";
import { buildTipUserSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateRandomString,
	getCookieHeader,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { BulkRewardTestData, RegisterTestData } from "@dtos/test-data";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardType } from "@enums/admin/reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { EvRewardTypes } from "@enums/ev-reward-types";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { TestUserRole } from "@enums/test-user-roles";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { HomePage } from "@pages/home-page/home-page";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { RewardsPage } from "@pages/rewards/rewards-page";
import { VerificationPage } from "@pages/verification/verification-page";
import { getISOWeek, getMonth, getYear } from "date-fns";
import { testData } from "test-data/test-data-manager";
import { CsvFilesName } from "@enums/csv-file-name";

test.describe(
	"User info - Rewards History - Custom rewards",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		const initialAmount = "$0.00";
		const amount = "$1.00";

		test.use(storageStateNewSuperAdminUserDB());

		test(
			`[ENG-7179] Custom rewards - reload`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for reload
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.RELOAD);

				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.PENDING,
						CustomRewardType.RELOAD,
						amount,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardHistoryTableColumnsAreVisible();

				// Assert that the reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.RELOAD,
						initialAmount,
						RewardStatus.PENDING,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardIsVisibleAndCanBeActivated(
						CustomRewardType.RELOADS,
						RewardButton.ACTIVATE,
					);

				// Activate the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.RELOAD,
					RewardButton.ACTIVATE,
				);

				await rewardsPage
					.assertThat()
					.rewardCanBeClaimed(
						CustomRewardType.RELOAD,
						RewardButton.CLAIM,
						amount,
					);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is active after activation
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.RELOAD,
						initialAmount,
						RewardStatus.ACTIVE,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.RELOAD,
					RewardButton.CLAIM,
				);
				await rewardsPage
					.assertThat()
					.rewardIsClaimedAndActive(
						CustomRewardType.RELOAD,
						RewardButton.AVAILABLE_IN,
					);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Active after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.RELOAD,
						amount,
						RewardStatus.ACTIVE,
					);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.ACTIVE,
						CustomRewardType.RELOAD,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward status is Canceled after revoking
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.RELOAD,
						amount,
						RewardStatus.CANCELED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Custom rewards - vip`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for VIP
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.VIP);

				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.PENDING,
						CustomRewardType.VIP,
						amount,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.VIP,
						amount,
						RewardStatus.PENDING,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardCanBeClaimed(
						CustomRewardType.VIP,
						RewardButton.CLAIM,
						amount,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.VIP,
					RewardButton.CLAIM,
				);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.VIP,
						amount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Custom rewards - vip - cancel`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomDb,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for VIP
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.VIP);

				// Assert that the reward is visible in the section
				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.PENDING,
						CustomRewardType.VIP,
						amount,
					);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.VIP,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward status is Canceled after revoking
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.VIP,
						amount,
						RewardStatus.CANCELED,
					);
			},
		);

		test(
			`[ENG-7179] Custom rewards - xp challenge`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for XP Challenge
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.XP_CHALLENGE, 0);

				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.PENDING,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
						RewardStatus.PENDING,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardIsVisibleAndCanBeActivated(
						CustomRewardType.XP_CHALLENGE_LABEL,
						RewardButton.ACTIVATE,
					);

				// Activate the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.XP_CHALLENGE_LABEL,
					RewardButton.ACTIVATE,
				);

				// Assert that the reward can be claimed
				await rewardsPage
					.assertThat()
					.rewardCanBeClaimed(
						CustomRewardType.XP_CHALLENGE_LABEL,
						RewardButton.CLAIM,
						amount,
					);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Active after activation
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
						RewardStatus.ACTIVE,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.XP_CHALLENGE_LABEL,
					RewardButton.CLAIM,
				);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Custom rewards - xp challenge - cancel`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomDb,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for XP Challenge
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.XP_CHALLENGE, 0);

				// Assert that the reward is visible in the section
				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.PENDING,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
					);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.XP_CHALLENGE_LABEL,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward status is Canceled after revoking
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_LABEL,
						amount,
						RewardStatus.CANCELED,
					);
			},
		);

		test(
			`[ENG-7179] Custom rewards - kyc verification`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for KYC Verification
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.KYC_VERIFICATION);

				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.ACTIVE,
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
						RewardStatus.ACTIVE,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardIsVisibleAndCanBeActivated(
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
					);

				// Activate the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.KYC_VERIFICATION_LABEL,
					amount,
				);

				const verificationPage = new VerificationPage(userPage);
				// Fill in the KYC Level 1 form
				await verificationPage.fillInKycLevel1Form();

				const notification = userHomePage.getNotification();
				await notification
					.assertThat()
					.titleIs(NotificationTitle.KYC_VERIFIED);

				await notification
					.assertThat()
					.subTitleIs(NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED);

				await rewardsPage.navigate();

				// Assert that the reward can be claimed after KYC verification
				await rewardsPage
					.assertThat()
					.rewardCanBeClaimed(
						CustomRewardType.KYC_VERIFICATION_LABEL,
						RewardButton.CLAIM,
						amount,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.KYC_VERIFICATION_LABEL,
					RewardButton.CLAIM,
				);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Custom rewards - kyc verification - cancel`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomDb,
				userInfoAdminPage,
				userInfoRewardsAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				await gamdomDb.createNewUser(newUserData);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				await userInfoRewardsAdminPage
					.assertThat()
					.newCustomRewardButtonVisible();

				// Set custom reward for KYC Verification
				await userInfoRewardsAdminPage
					.steps()
					.setCustomReward(CustomRewardType.KYC_VERIFICATION);

				// Assert that the reward is visible in the section
				await userInfoRewardsAdminPage
					.assertThat()
					.rewardVisibleInSection(
						RewardStatus.ACTIVE,
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
					);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.ACTIVE,
						CustomRewardType.KYC_VERIFICATION_LABEL,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward status is Canceled after revoking
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.KYC_VERIFICATION_LABEL,
						amount,
						RewardStatus.CANCELED,
					);
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Promo campaigns",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		let qrCode2FAImagePath: string;
		const ammount = "$100.00";

		const cashCampaignName = generateRandomString({ length: 5 });
		const cashCampaignCode = generateRandomString({ length: 7 });
		const freeSpinsCampaignName = generateRandomString({ length: 5 });
		const freeSpinsCampaignCode = generateRandomString({ length: 7 });

		test.afterEach(async () => {
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		});

		test.use(storageStateNewSuperAdminUserDB());

		test(
			`[ENG-7179] Rewards history - Promo code - cash`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsHistoryAdminPage,
				settingsPage,
				promoCampaignsAdminPage,
				promoCodeModal,
				twoFactorAuthModal,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				qrCode2FAImagePath = createPngImagePath();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				//Create a new promo campaign
				await settingsPage
					.steps()
					.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
				await promoCampaignsAdminPage.navigate();
				await promoCampaignsAdminPage.clickCreateCampaignButton();
				await promoCodeModal.assertThat().isNotDisplayed();
				await twoFactorAuthModal
					.steps()
					.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
				await promoCodeModal
					.steps()
					.createDefaultCashPromoCodeSuccessfully(
						cashCampaignName,
						cashCampaignCode,
					);

				await userHomePage.navigateToWallet();

				// Redeem the promo code
				const walletModal = new WalletModal(userPage);
				await walletModal
					.steps()
					.redeemPromoCodeSuccessfully(cashCampaignCode);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward is visible and claimed in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.PROMO_CAMPAIGN_CASH,
						CustomRewardType.CASH,
						ammount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Rewards history - Promo code - free spins`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsHistoryAdminPage,
				settingsPage,
				promoCampaignsAdminPage,
				promoCodeModal,
				twoFactorAuthModal,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();
				qrCode2FAImagePath = createPngImagePath();
				await gamdomDb.createNewUser(newUserData);
				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);
				const userHomePage = new HomePage(userPage);
				await userHomePage.navigate();

				// Create a new promo campaign
				await settingsPage
					.steps()
					.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
				await promoCampaignsAdminPage.navigate();
				await promoCampaignsAdminPage.clickCreateCampaignButton();
				await promoCodeModal.assertThat().isNotDisplayed();
				await twoFactorAuthModal
					.steps()
					.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
				await promoCodeModal
					.steps()
					.createDefaultFreeSpinsPromoCodeSuccessfully(
						freeSpinsCampaignName,
						freeSpinsCampaignCode,
					);

				await userHomePage.navigateToWallet();

				// Redeem the promo code
				const walletModal = new WalletModal(userPage);
				await walletModal
					.steps()
					.redeemPromoCodeSuccessfully(freeSpinsCampaignCode);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the reward is visible and active in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.PROMO_CAMPAIGN_FREE_SPINS,
						CustomRewardType.FREE_SPINS,
						"10×$0.10",
						RewardStatus.ACTIVE,
					);

				await userContext.close();
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Tips",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		let qrCode2FAImagePath: string;
		const tipAmount = 1;
		const amount = "$1.00";

		const tipTypes = [
			{
				tipType: "giveaway",
				rewardType: CustomRewardType.GIVEAWAY,
			},
			{
				tipType: "deposit bonus",
				rewardType: CustomRewardType.DEPOSIT_BONUS,
			},
		];

		test.afterEach(async () => {
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		});

		test.use(storageStateNewSuperAdminUserDB());

		tipTypes.forEach(({ tipType, rewardType }) => {
			test(
				`[ENG-7179] Rewards history - Tip - ${tipType}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({
					infoAdminPage,
					userInfoAdminPage,
					userInfoRewardsHistoryAdminPage,
					toast,
					settingsPage,
					gamdomDb,
					testDataObject,
				}) => {
					const newUserData = testDataObject.register.random();
					await gamdomDb.createNewUser(newUserData);
					qrCode2FAImagePath = createPngImagePath();

					//tip user with 2FA flow
					await settingsPage
						.steps()
						.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
					await userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(newUserData.username);
					await infoAdminPage
						.steps()
						.tipUserWith2FaFlow(
							tipAmount,
							qrCode2FAImagePath,
							tipType,
						);
					await toast.assertThat().subTitleIs(
						buildTipUserSubTitle({
							username: newUserData.username,
							tipAmount: tipAmount,
						}),
					);

					await userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.RewardHistory,
					);

					await userInfoRewardsHistoryAdminPage
						.assertThat()
						.rewardsHistoryTableVisible();

					// Assert that the reward is visible in the history
					await userInfoRewardsHistoryAdminPage
						.assertThat()
						.rewardStatusIs(
							RewardsSource.TIP,
							rewardType,
							amount,
							RewardStatus.COMPLETED,
						);
				},
			);
		});
	},
);

test.describe(
	"User info - Rewards History - Royalty up and Instant reward",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		const royaltyUpAmount = "$5.00";
		const instantRewardAmount = "$26.25";
		const userBeXpBronze3 = 15000000;
		let user: AuthenticatedUser;
		let superAdminSession: BrowserUserSession;

		test.beforeEach(
			async ({
				gamdomApiDbFacade,
				page,
				diceGamePage,
				rewardsPage,
				testDataObject,
				browserSessionManager,
			}) => {
				user = await gamdomApiDbFacade.createSingleUserDbAndAuth({
					emailVerified: true,
					startingXp: userBeXpBronze3 - 1,
				});
				await setAuthenticationCookies(page, user.cookie);

				const betTestData = testDataObject.bet.build(
					{ username: user.user.username },
					{ betAmount: 5000, autoCashoutMultiplier: 2 },
				);
				await diceGamePage.navigate();
				await diceGamePage.rollDiceWithAmount(betTestData.betAmount);

				await rewardsPage.navigate();
				// Assert that the Instant and Royalty Up rewards are available
				await rewardsPage
					.assertThat()
					.instantAndRoyaltyUpRewardsAreAvailable();

				superAdminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
				);

				await superAdminSession.pages.userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(user.user.username);
			},
		);

		test(
			`[ENG-7179] Rewards history - Royalty up and instant`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ rewardsPage }) => {
				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the Instant and Royalty Up rewards are visible in the history
				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.PENDING,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.PENDING,
					);

				// Claim the Instant and Royalty Up rewards
				await rewardsPage.claimReward(RewardType.INSTANT);
				await rewardsPage.claimSingleRoyaltyUpReward();

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the Instant and Royalty Up rewards are Claimed in the history
				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CLAIMED,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CLAIMED,
					);
			},
		);

		test(
			`[ENG-7179] Rewards history - Royalty up and instant - cancel`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async () => {
				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.Rewards,
				);
				// Revoke the Instant and Royalty Up rewards
				await superAdminSession.pages.userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.INSTANT_RAKEBACK,
					);
				await superAdminSession.pages.userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.ROYALTY_UP,
					);

				await superAdminSession.pages.userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the Instant and Royalty Up rewards are Canceled in the history
				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CANCELED,
					);

				await superAdminSession.pages.userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CANCELED,
					);
			},
		);
	},
);

test.describe(
	"User info - Rewards History - Weekly and monthly",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test.use(storageStateNewSuperAdminUserDB());
		const weeklyAmount = "$0.01";
		const monthlyAmount = "$0.07";

		test(
			`[ENG-7179] Rewards history - Weekly reward`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const superAdminData = new RegisterTestData({
					useGamdomEmailDomain: true,
				});

				await gamdomDb.createNewUser({
					username: superAdminData.username,
					password: superAdminData.password,
					email: superAdminData.email,
					tags: UserTags.SuperAdmin,
					userClass: UserClasses.Admin,
					emailVerified: true,
				});
				// Authenticate as super admin to get the cookie
				const superAdminCookie = getCookieHeader(
					await gamdomApi.authenticateWithExistingUser(
						superAdminData.username,
						superAdminData.password,
					),
				);

				const newUserData = testDataObject.register.random();

				await gamdomDb.createNewUser(newUserData);

				// Get the user ID
				const userId = (
					await gamdomApi.getBasicInfo(
						newUserData.username,
						newUserData.password,
					)
				).user.id;

				const year = getYear(new Date());
				const week = getISOWeek(new Date());
				const weekString = `weekly-${year}-W${String(week).padStart(
					2,
					"0",
				)}`;

				const rewardType = CustomRewardType.EV_REWARD;
				const weeklyReward = [{ userId: userId, rewardCoins: 10 }];

				// Create the bulk reward test data
				const bulkRewardTestDataWeekly = new BulkRewardTestData(
					rewardType,
					weeklyReward,
					weekString,
				);

				// Send the bulk reward request
				await gamdomApi.bulkReward(bulkRewardTestDataWeekly, {
					Cookie: superAdminCookie,
				});

				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the weekly reward is visible and available
				await rewardsPage
					.assertThat()
					.weeklyRewardIsVisibleAndAvailable();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the weekly reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.EV_REWARD_LABEL,
						weeklyAmount,
						RewardStatus.PENDING,
					);

				// Claim the weekly reward
				await rewardsPage.claimReward(RewardType.WEEKLY);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the weekly reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.EV_REWARD_LABEL,
						weeklyAmount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Rewards history - Monthly reward`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsHistoryAdminPage,
				testDataObject,
			}) => {
				const superAdminData = new RegisterTestData({
					useGamdomEmailDomain: true,
				});

				await gamdomDb.createNewUser({
					username: superAdminData.username,
					password: superAdminData.password,
					email: superAdminData.email,
					tags: UserTags.SuperAdmin,
					userClass: UserClasses.Admin,
					emailVerified: true,
				});

				// Authenticate as super admin to get the cookie
				const superAdminCookie = getCookieHeader(
					await gamdomApi.authenticateWithExistingUser(
						superAdminData.username,
						superAdminData.password,
					),
				);

				const newUserData = testDataObject.register.random();

				await gamdomDb.createNewUser(newUserData);

				// Get the user ID
				const userId = (
					await gamdomApi.getBasicInfo(
						newUserData.username,
						newUserData.password,
					)
				).user.id;

				const year = getYear(new Date());
				const month = getMonth(new Date()) + 1;
				const monthString = `monthly-${year}-${String(month).padStart(
					2,
					"0",
				)}`;
				const rewardType = CustomRewardType.EV_REWARD;

				const monthlyReward = [{ userId: userId, rewardCoins: 100 }];

				// Create the bulk reward test data
				const bulkRewardTestDataMonthly = new BulkRewardTestData(
					rewardType,
					monthlyReward,
					monthString,
				);

				// Send the bulk reward request
				await gamdomApi.bulkReward(bulkRewardTestDataMonthly, {
					Cookie: superAdminCookie,
				});

				const userCookie = await gamdomApi.authenticateWithExistingUser(
					newUserData.username,
					newUserData.password,
				);

				// Create a new browser context for the user
				const userContext = await browser.newContext();
				const userPage = await userContext.newPage();
				await setAuthenticationCookies(userPage, userCookie);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the monthly reward is visible and available
				await rewardsPage
					.assertThat()
					.monthlyRewardIsVisibleAndAvailable();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the monthly reward is visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.EV_REWARD_LABEL,
						monthlyAmount,
						RewardStatus.PENDING,
					);

				// Claim the monthly reward
				await rewardsPage.claimReward(RewardType.MONTHLY);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the monthly reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.EV_REWARD_LABEL,
						monthlyAmount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);
	},
);

test.describe(
	"User info - Rewards - Custom xp_challenge reward",
	testDetails()
		.withTags(
			JiraComponent.REWARDS,
			JiraComponent.ADMIN_PANEL,
			JiraComponent.USER_INFO,
		)
		.apply(),
	() => {
		test(
			`[ENG-11140] Create and claim xp_challenge reward`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				browserSessionManager,
				testDataPredefined,
				xpChallengeTestFlow,
			}) => {
				const evRewardsSystemSuperAdmin =
					await browserSessionManager.loginAs(
						TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
						{ reuseContext: true },
					);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const xpChallengeData = testDataPredefined.data.xpChallenge;

				await xpChallengeTestFlow.adminCreateXpChallenge({
					adminUser: evRewardsSystemSuperAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					evRequired: xpChallengeData.evRequired,
					challengeDuration: xpChallengeData.challengeDuration,
					rewardAmount: xpChallengeData.rewardAmount,
				});

				await xpChallengeTestFlow.userActivateAndClaimXpChallenge({
					user: regularUser,
					betAmount: xpChallengeData.betAmount,
					rewardAmount: xpChallengeData.rewardAmount,
				});
			},
		);
	},
);

test.describe(
	"User info - Rewards - Custom reload reward",
	testDetails()
		.withTags(
			JiraComponent.REWARDS,
			JiraComponent.ADMIN_PANEL,
			JiraComponent.SPECIAL_REWARDS,
		)
		.apply(),
	() => {
		test(
			`[ENG-10167] Reload Reward creation and activation`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				browserSessionManager,
				testDataPredefined,
				reloadRewardTestFlow,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);
				const reloadRewardData = testDataPredefined.data.reloadReward;

				await reloadRewardTestFlow.adminCreateReloadReward({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					amount: reloadRewardData.amount,
				});

				await reloadRewardTestFlow.userActivateReloadReward({
					user: regularUser,
					amount: reloadRewardData.amount,
				});

				await reloadRewardTestFlow.adminVerifyReloadRewardIsActive({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					totalAmount: reloadRewardData.totalAmount,
				});
			},
		);

		test(
			`[ENG-10170] Change Reload Reward`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				browserSessionManager,
				gamdomDb,
				changeReloadRewardTestFlow,
				testDataPredefined,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const regularUserId =
					regularUser.getAuthenticatedUser().user.userId;
				const adminUserId =
					adminUserInfoAdmin.getAuthenticatedUser().user.userId;

				const reloadRewardData = testDataPredefined.data.reloadReward;

				await gamdomDb.insertReloadReward(regularUserId, adminUserId);

				await changeReloadRewardTestFlow.changeReloadReward({
					adminUser: adminUserInfoAdmin,
					targetUsername:
						regularUser.getAuthenticatedUser().user.username,
					newRewardTotal: reloadRewardData.newTotalReward,
					newTotalAmount: reloadRewardData.newTotalAmount,
				});
			},
		);

		test(
			`[ENG-10269] Reload update - Skipped claims logic`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				browserSessionManager,
				gamdomDb,
				testDataPredefined,
				claimReloadRewardTestFlow,
				verifyReloadRewardPresenceTestFlow,
			}) => {
				const adminUserInfoAdmin = await browserSessionManager.loginAs(
					TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
					{ reuseContext: true },
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const regularUserId =
					regularUser.getAuthenticatedUser().user.userId;
				const adminUserId =
					adminUserInfoAdmin.getAuthenticatedUser().user.userId;

				const reloadRewardData =
					testDataPredefined.data.reloadRewardWithUpdatedTotal;

				await gamdomDb.insertReloadReward(
					regularUserId,
					adminUserId,
					reloadRewardData.reloadCoins,
					reloadRewardData.expirationMs,
					reloadRewardData.claimIntervalMs,
					reloadRewardData.amountCoins,
					EvRewardTypes.RELOAD,
					RewardStatus.ACTIVE,
					reloadRewardData.daysOffset,
					reloadRewardData.daysToExpire,
					null,
					true,
					reloadRewardData.updatedNewTotal,
					reloadRewardData.modifiedDateDaysOffset,
				);

				await verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsPresent(
					{
						adminUser: adminUserInfoAdmin,
						targetUsername:
							regularUser.getAuthenticatedUser().user.username,
						section: RewardStatus.ACTIVE,
					},
				);

				await claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance(
					{
						user: regularUser,
						rewardAmount: reloadRewardData.newReloadAmount,
						expectedBalanceIncrease:
							reloadRewardData.balanceIncrease,
					},
				);

				await verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsAbsent(
					{
						adminUser: adminUserInfoAdmin,
						targetUsername:
							regularUser.getAuthenticatedUser().user.username,
						section: RewardStatus.ACTIVE,
					},
				);
			},
		);

		testData()
			.fromCsvParsed({
				file: CsvFilesName.RELOAD_UPDATE_AFTER_PARTIAL_CLAIM,
			})
			.forEach((input) => {
				test(
					`[ENG-10259] Reload update logic after partial claim - Admin: ${input.adminExpected} | Client: ${input.clientExpected}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({
						browserSessionManager,
						gamdomDb,
						changeReloadRewardTestFlow,
						claimReloadRewardTestFlow,
						testDataPredefined,
					}) => {
						const adminUserInfoAdmin =
							await browserSessionManager.loginAs(
								TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
								{ reuseContext: true },
							);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);

						const regularUserId =
							regularUser.getAuthenticatedUser().user.userId;
						const adminUserId =
							adminUserInfoAdmin.getAuthenticatedUser().user
								.userId;

						const reloadRewardData =
							testDataPredefined.data
								.reloadRewardWithUpdatedTotal;

						await gamdomDb.insertReloadReward(
							regularUserId,
							adminUserId,
							input.reloadCoins,
							reloadRewardData.expirationMs,
							reloadRewardData.claimIntervalMs,
							reloadRewardData.amountCoins,
							EvRewardTypes.RELOAD,
							RewardStatus.ACTIVE,
							0,
							input.days,
							null,
						);

						await claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance(
							{
								user: regularUser,
								rewardAmount: input.dailyRewardAmount,
								expectedBalanceIncrease: input.dailyReward,
								expectedRewardMissing: false,
							},
						);

						await gamdomDb.updateRewardsDates(
							regularUserId,
							input.updateRewardsDays,
						);
						await gamdomDb.updateClaimHistoryDates(
							regularUserId,
							input.updateRewardsDays,
						);

						await changeReloadRewardTestFlow.changeReloadReward({
							adminUser: adminUserInfoAdmin,
							targetUsername:
								regularUser.getAuthenticatedUser().user
									.username,
							newRewardTotal: input.totalRewards,
							newTotalAmount: input.totalRewardsAmount,
							shouldToastBePresent: input.shouldToastBePresent,
							shouldRewardBePresent: input.shouldRewardBePresent,
							expectedToastType: input.expectedToastType,
						});

						await regularUser.pages.rewardsPage.navigate();

						await regularUser.pages.rewardsPage
							.assertThat()
							.verifyRewardClaimability(
								CustomRewardType.RELOAD,
								input.shouldRewardBeClaimable,
								RewardButton.CLAIM,
								input.perClaimAmount,
							);
					},
				);
			});

		testData()
			.fromCsvParsed({
				file: CsvFilesName.RELOAD_UPDATE_LOGIC,
			})
			.forEach((input) => {
				test(
					`[ENG-10268] Reload update logic for: days: ${input.days} | dailyReward: ${input.dailyReward} | totalReward: ${input.totalReward}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({
						browserSessionManager,
						gamdomDb,
						testDataPredefined,
						verifyReloadUpdateLogicTestFlow,
					}) => {
						const adminUserInfoAdmin =
							await browserSessionManager.loginAs(
								TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO,
								{ reuseContext: true },
							);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);

						const regularUserId =
							regularUser.getAuthenticatedUser().user.userId;
						const adminUserId =
							adminUserInfoAdmin.getAuthenticatedUser().user
								.userId;

						const reloadRewardData =
							testDataPredefined.data
								.reloadRewardWithUpdatedTotal;

						await gamdomDb.insertReloadReward(
							regularUserId,
							adminUserId,
							input.reloadCoins,
							reloadRewardData.expirationMs,
							reloadRewardData.claimIntervalMs,
							reloadRewardData.amountCoins,
							EvRewardTypes.RELOAD,
							RewardStatus.ACTIVE,
							0,
							input.days,
							null,
							true,
							input.updateNewTotal,
						);

						await verifyReloadUpdateLogicTestFlow.verifyReloadUpdateLogic(
							{
								user: regularUser,
								adminUser: adminUserInfoAdmin,
								rewardAmount: input.perClaimExpectedAmount,
								expectedBalanceIncrease: input.perClaimExpected,
								expectedClaimedDays: input.expectedClaimedDays,
								totalDays: input.days,
							},
						);
					},
				);
			});
	},
);
