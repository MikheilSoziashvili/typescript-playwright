import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserAPI } from "../fixtures/auth-fixtures";

test.describe("Gift card generation tests", () => {
	let qrCode2FAImagePath: string;
	const giftValue = "10";
	const giftQuantity = "1000";
	const userData = new RegisterTestData();

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(
		storageStateNewSuperAdminUserAPI({
			username: userData.username,
			password: userData.password,
			email: userData.email,
		}),
	);

	test("[ENG-2568] Gift ard generation - Require new 2FA code when IP of user changes", async ({
		giftCardsAdminPage,
		twoFactorAuthModal,
		browser,
	}) => {
		let context = await browser.newContext();
		const pages = { giftCardsAdminPage, twoFactorAuthModal };
		const initialPage = await initializePageObjects(
			context,
			...Object.values(pages),
		);

		await giftCardsAdminPage.navigate();
		await giftCardsAdminPage.assertThat().pageElementsAreVisible();
		await giftCardsAdminPage
			.steps()
			.generateGiftCardFromGenerator(giftValue, giftQuantity);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
		await giftCardsAdminPage.refresh();
		await giftCardsAdminPage
			.steps()
			.generateGiftCardFromGenerator(giftValue, giftQuantity);

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await giftCardsAdminPage.navigate();
		await giftCardsAdminPage.assertThat().pageElementsAreVisible();
		await giftCardsAdminPage
			.steps()
			.generateGiftCardFromGenerator(giftValue, giftQuantity);
		await twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
	});
});
