import { MAILINATOR_DOMAIN } from "@constants/domains";
import {
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { test } from "fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";

test.describe("Email Verification Tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test("[ENG-1133] E-mail verification - new account", async ({
		mailinatorApi,
		page,
		profilePage,
		gamdomApi,
	}) => {
		// reduce code duplication from 19-23 to be in a beforeEach (eventually take them out in another describe)
		let { email, inbox } = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		const cookie = await gamdomApi.authenticateWithNewUser(userData);
		await setAuthenticationCookies(page, cookie);

		({ email, inbox } = generateEmailAndInbox(userData.email));

		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				inbox,
				page,
			);
	});

	test("[ENG-1121] E-mail verification", async ({
		mailinatorApi,
		page,
		profilePage,
		gamdomApi,
	}) => {
		let { email, inbox } = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		const cookie = await gamdomApi.authenticateWithNewUser(userData);
		await setAuthenticationCookies(page, cookie);

		({ email, inbox } = generateEmailAndInbox(userData.email));

		await profilePage.navigate();
		await profilePage.steps().completeVerificationFlow();

		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				inbox,
				page,
				{ messageIndex: 2 },
			);
	});

	test("[ENG-1132] E-mail verification - changing e-mail", async ({
		gamdomApiDbFacade,
		mailinatorApi,
		page,
		profilePage,
	}) => {
		const { email } = generateEmailAndInbox();
		const newEmailData = generateEmailAndInbox();

		const { cookie } = await gamdomApiDbFacade.createSingleUserDbAndAuth({
			email: email,
		});

		await setAuthenticationCookies(page, cookie);

		await profilePage.navigate();
		await profilePage.steps().changeEmailSuccessfully(newEmailData.email);

		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				newEmailData.inbox,
				page,
			);
	});
});
