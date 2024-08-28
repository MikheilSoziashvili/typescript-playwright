import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Use affiliate code", () => {
	test.slow();
	test("[ENG-297] Create an affiliate code and use it with a new account @smoke", async ({
		homePage,
		affiliatesPage,
		rewardsPage,
		faqPage,
		notifications,
		toast,
		gamdomApi,
		page,
	}) => {
		const cookie = await gamdomApi.authenticateWithNewUser(
			new RegisterTestData(),
		);
		await setAuthenticationCookies(page, cookie);
		await affiliatesPage.navigate();
		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);

		await homePage.navigate({ cookies: { clearCookies: true } });

		const newCookie = await gamdomApi.authenticateWithNewUser(
			new RegisterTestData(),
		);
		await setAuthenticationCookies(page, newCookie);

		await rewardsPage.navigate();
		await rewardsPage.steps().claimCode(AUTOMATION_AFFILIATES_CODE);

		await notifications.assertThat().isDisplayed();
		await notifications
			.assertThat()
			.titleIs(NotificationTitle.WELCOME_BONUS);
		await notifications.aknowledge({
			title: NotificationTitle.WELCOME_BONUS,
		});
		await notifications.assertThat().isNotDisplayed();

		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.CLAIMED_BONUS,
		});
		await toast.assertThat().isNotDisplayed({
			subTitle: ToastSubTitle.CLAIMED_BONUS,
		});

		await faqPage.navigate();
		await faqPage.expandAffiliateCodeRegisteredUnderSection();
		await faqPage
			.assertThat()
			.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
	});
});
