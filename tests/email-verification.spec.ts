import { MAILINATOR_DOMAIN } from "@constants/domains";
import { generateEmailAndInbox } from "@core/utils/utils";
import { test } from "fixtures/fixtures";

test.describe("Email Verification Tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test("[ENG-1133] E-mail verification - new account", async ({
		homePage,
		mailinatorApi,
		page,
		profilePage,
	}) => {
		const { email, inbox } = generateEmailAndInbox();

		await homePage.steps().registerNewUser({ email });

		// Poll for the verification email and perform verification
		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				inbox,
				page,
				1,
			);
	});

	test("[ENG-1121] E-mail verification", async ({
		homePage,
		mailinatorApi,
		page,
		profilePage,
	}) => {
		const { email, inbox } = generateEmailAndInbox();

		await homePage.steps().registerNewUser({ email });

		// Wait for the verification email and delete the inbox content
		await mailinatorApi.pollForMessages(MAILINATOR_DOMAIN, inbox);
		//await mailinatorApi.deleteInbox(MAILINATOR_DOMAIN, inbox);

		// Complete verification flow and wait for the new verification email
		await profilePage.navigate();
		await profilePage.steps().completeVerificationFlow();

		// Poll for the new verification email and perform verification
		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				inbox,
				page,
				2,
			);
	});
});
