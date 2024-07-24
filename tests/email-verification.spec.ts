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

		await gamdomApiActions.authenticateWithNewUser(userData);

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
		gamdomApiActions,
	}) => {
		const { email, inbox } = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		await gamdomApiActions.authenticateWithNewUser(userData);

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
		mailinatorApi,
		page,
		profilePage,
		gamdomApiActions,
	}) => {
		const { email } = generateEmailAndInbox();
		const newEmailData = generateEmailAndInbox();
		const userData = new RegisterTestData({ email });

		await gamdomApiActions.authenticateWithNewUser(userData);

		await profilePage.navigate();
		await profilePage.steps().changeEmail(newEmailData.email);

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
