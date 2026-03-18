import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { NotificationTitle } from "@enums/notification-titles";
import { TestTag } from "@enums/test-tags";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Use affiliate code", () => {
	test.use(storageStateNewUserDB());

	test.slow();
	test(
		"[ENG-297] Create an affiliate code and use it with a new account",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.AFFILIATES)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({
			homePage,
			affiliatesPage,
			rewardsPage,
			faqPage,
			notifications,
			toast,
			gamdomApi,
			gamdomDb,
			page,
			testDataObject,
		}) => {
			await affiliatesPage.navigate();
			await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);

			await homePage.navigate({ cookies: { clearCookies: true } });

			const newUser = testDataObject.register.random();

			await gamdomDb.createNewUser(newUser);
			const newCookie = await gamdomApi.authenticateWithExistingUser(
				newUser.username,
				newUser.password,
			);
			await setAuthenticationCookies(page, newCookie);

			await rewardsPage.navigate();
			await rewardsPage.steps().claimCode(AUTOMATION_AFFILIATES_CODE);

			await notifications.assertThat().isDisplayed();
			await notifications
				.assertThat()
				.titleIs(NotificationTitle.WELCOME_BONUS);

			await toast.assertThat().titleIs(ToastTitle.SUCCESS);

			await faqPage.navigate();
			await faqPage.expandAffiliateCodeRegisteredUnderSection();
			await faqPage
				.assertThat()
				.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
		},
	);
});
