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
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { HomePage } from "@pages/home-page/home-page";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { RewardsPage } from "@pages/rewards/rewards-page";
import { VerificationPage } from "@pages/verification/verification-page";
import { getISOWeek, getMonth, getYear } from "date-fns";

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
						CustomRewardType.XP_CHALLENGE,
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
						CustomRewardType.XP_CHALLENGE_USER,
						amount,
						RewardStatus.PENDING,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardIsVisibleAndCanBeActivated(
						CustomRewardType.XP_CHALLENGE_USER,
						RewardButton.ACTIVATE,
					);

				// Activate the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.XP_CHALLENGE_USER,
					RewardButton.ACTIVATE,
				);

				// Assert that the reward can be claimed
				await rewardsPage
					.assertThat()
					.rewardCanBeClaimed(
						CustomRewardType.XP_CHALLENGE_USER,
						RewardButton.CLAIM,
						amount,
					);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Active after activation
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_USER,
						amount,
						RewardStatus.ACTIVE,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.XP_CHALLENGE_USER,
					RewardButton.CLAIM,
				);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.XP_CHALLENGE_USER,
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
						CustomRewardType.XP_CHALLENGE,
						amount,
					);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.XP_CHALLENGE,
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
						CustomRewardType.XP_CHALLENGE_USER,
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
						CustomRewardType.KYC_VERIFICATION,
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
						CustomRewardType.KYC_VERIFICATION_USER,
						amount,
						RewardStatus.ACTIVE,
					);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the reward is visible and can be activated
				await rewardsPage
					.assertThat()
					.rewardIsVisibleAndCanBeActivated(
						CustomRewardType.KYC_VERIFICATION_USER,
						amount,
					);

				// Activate the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.KYC_VERIFICATION_USER,
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
						CustomRewardType.KYC_VERIFICATION_USER,
						RewardButton.CLAIM,
						amount,
					);

				// Claim the reward
				await rewardsPage.clickOnRewardButton(
					CustomRewardType.KYC_VERIFICATION_USER,
					RewardButton.CLAIM,
				);

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the reward status is Claimed after claiming
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.KYC_VERIFICATION_USER,
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
						CustomRewardType.KYC_VERIFICATION,
						amount,
					);

				// Revoke the reward
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.ACTIVE,
						CustomRewardType.KYC_VERIFICATION,
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
						CustomRewardType.KYC_VERIFICATION_USER,
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
				await promoCampaignsAdminPage.clickCreateCampaignButton();
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
				await promoCampaignsAdminPage.clickCreateCampaignButton();
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
						"10×$0.20",
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
		test.use(storageStateNewSuperAdminUserDB());

		const royaltyUpAmount = "$5.00";
		const instantRewardAmount = "$2.50";

		test(
			`[ENG-7179] Rewards history - Royalty up and instant`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
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

				// Navigate to the Dice game and play one round
				const diceGamePage = new DiceGamePage(userPage);
				await diceGamePage.navigate();
				await diceGamePage.rollDiceWithAmount(5000);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the Instant and Royalty Up rewards are available
				await rewardsPage
					.assertThat()
					.instantAndRoyaltyUpRewardsAreAvailable();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the Instant and Royalty Up rewards are visible in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.PENDING,
					);

				await userInfoRewardsHistoryAdminPage
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

				await userInfoRewardsHistoryAdminPage.refresh();

				// Assert that the Instant and Royalty Up rewards are Claimed in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CLAIMED,
					);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CLAIMED,
					);

				await userContext.close();
			},
		);

		test(
			`[ENG-7179] Rewards history - Royalty up and instant - cancel`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				browser,
				userInfoAdminPage,
				userInfoRewardsHistoryAdminPage,
				userInfoRewardsAdminPage,
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

				// Navigate to the Dice game and play one round
				const diceGamePage = new DiceGamePage(userPage);
				await diceGamePage.navigate();
				await diceGamePage.rollDiceWithAmount(5000);

				const rewardsPage = new RewardsPage(userPage);
				await rewardsPage.navigate();

				// Assert that the Instant and Royalty Up rewards are available
				await rewardsPage
					.assertThat()
					.instantAndRoyaltyUpRewardsAreAvailable();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(newUserData.username);

				await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Rewards);

				// Revoke the Instant and Royalty Up rewards
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.INSTANT_RAKEBACK_LABEL,
					);
				await userInfoRewardsAdminPage
					.steps()
					.clickRevokeRewardButton(
						RewardStatus.PENDING,
						CustomRewardType.ROYALTY_UP_LABEL,
					);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.RewardHistory,
				);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardsHistoryTableVisible();

				// Assert that the Instant and Royalty Up rewards are Canceled in the history
				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.INSTANT_RAKEBACK,
						instantRewardAmount,
						RewardStatus.CANCELED,
					);

				await userInfoRewardsHistoryAdminPage
					.assertThat()
					.rewardStatusIs(
						RewardsSource.REWARDS,
						CustomRewardType.ROYALTY_UP,
						royaltyUpAmount,
						RewardStatus.CANCELED,
					);

				await userContext.close();
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
