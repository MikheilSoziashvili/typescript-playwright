import { test } from "fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";
import { generateRandomString } from "@core/utils/utils";

const domain = "gamdom.testinator.com";

test.describe("Email Verification Tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test("[ENG-1133] E-mail verification - new account @smoke", async ({
		homePage,
		mailinatorApi,
		page,
		profilePage,
	}) => {
		const email = `${generateRandomString({
			prefix: "gmdverify",
			length: 10,
		})}@${domain}`;
		const inbox = email.split("@")[0];

		// Step 1: Register a new user
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openRegisterModal();

		const registeredData = new RegisterTestData(
			undefined,
			undefined,
			email,
		);
		await homePage.registerModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage.assertThat().userIsRegistered(registeredData.username);

		// Step 2: Wait for the verification email
		await new Promise((r) => setTimeout(r, 10000));

		// Step 3: Fetch messages using Mailinator API
		const messages = await mailinatorApi.getMessages(domain, inbox);

		const verificationEmailId = messages[0].id;

		// Step 4: Fetch the email links and navigate to the verification link
		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			verificationEmailId,
		);
		const verificationLink = emailLinks.links[0];

		await page.goto(verificationLink);

		// Step 5: Assert account is already verified
		await profilePage.navigate();
		await profilePage.verifyButtonNotVisible();
	});

	test("[ENG-1121] E-mail verification @smoke", async ({
		homePage,
		mailinatorApi,
		page,
		profilePage,
	}) => {
		const email = `${generateRandomString({
			prefix: "gmdverify",
			length: 10,
		})}@${domain}`;
		const inbox = email.split("@")[0];

		// Step 1: Register a new user
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openRegisterModal();

		const registeredData = new RegisterTestData(
			undefined,
			undefined,
			email,
		);
		await homePage.registerModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage.assertThat().userIsRegistered(registeredData.username);

		// Step 2: Wait for the verification email and delete the inbox content
		await new Promise((r) => setTimeout(r, 10000));
		await mailinatorApi.deleteInbox(domain, inbox);

		// Step 5: Complete verification flow and wait for the new verification email
		await profilePage.navigate();
		await profilePage.completeVerificationFlow();
		await new Promise((r) => setTimeout(r, 10000));

		// Step 3: Fetch messages using Mailinator API
		const messages = await mailinatorApi.getMessages(domain, inbox);
		const verificationEmailId = messages[0].id;

		// Step 4: Fetch the email links and navigate to the new verification link
		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			verificationEmailId,
		);
		const verificationLink = emailLinks.links[0];

		await page.goto(verificationLink);

		// Step 5: Assert account is already verified
		await profilePage.navigate();
		await profilePage.verifyButtonNotVisible();
	});
});
