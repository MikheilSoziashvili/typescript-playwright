import { MAILINATOR_DOMAIN } from "@constants/domains";
import { generateEmailAndInbox } from "@core/utils/utils";
import { test } from "fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";

test.describe("Email Verification Tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test("[ENG-1133] E-mail verification - new account", async ({
		mailinatorApi,
		page,
		profilePage,
		gamdomApiActions,
	}) => {
		const { email, inbox } = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		// Register and authenticate the user via the API
		await gamdomApiActions.authenticateWithNewUser(userData);

		// Poll for the verification email and perform verification
		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				inbox,
				page,
				{ messageIndex: 1 },
			);
	});

	test("[ENG-1121] E-mail verification", async ({
		mailinatorApi,
		page,
		profilePage,
		gamdomApiActions,
	}) => {
		const { email, inbox } = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		// Register and authenticate the user via the API
		await gamdomApiActions.authenticateWithNewUser(userData);

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
				{ messageIndex: 2 },
			);
	});

	test("[ENG-1132] E-mail verification - changing e-mail", async ({
		mailinatorApi,
		page,
		profilePage,
		gamdomApiActions,
	}) => {
		const { email } = generateEmailAndInbox();
		const newEmailData = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		// Register and authenticate the user via the API
		await gamdomApiActions.authenticateWithNewUser(userData);

		// Login with the user and change the email
		await profilePage.navigate();
		await profilePage.steps().changeEmail(newEmailData.email);

		// Poll for the new verification email and perform verification
		await profilePage
			.steps()
			.verifyEmailAndCheckProfile(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				newEmailData.inbox,
				page,
				{ messageIndex: 1 },
			);
	});
});
