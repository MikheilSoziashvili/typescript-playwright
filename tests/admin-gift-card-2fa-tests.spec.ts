import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { TestTag } from "@enums/test-tags";

test.describe("Gift card generation tests", () => {
	let qrCode2FAImagePath: string;
	const giftValue = "10";
	const giftQuantity = "1000";

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewSuperAdminUserDB());

	test(
		"[ENG-2568] Gift card generation - Require new 2FA code when IP of user changes",
		testDetails()
			.withTags(JiraComponent.GIFTCARDS, JiraComponent.TWO_FA, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ giftCardsAdminPage, twoFactorAuthModal, browser }) => {
			const pages = { giftCardsAdminPage, twoFactorAuthModal };
			const initialPage = await initializePageObjects(
				await browser.newContext(),
				...Object.values(pages),
			);

			await giftCardsAdminPage
				.steps()
				.navigateAndGenerateGiftCardWith2FaFlow(
					giftValue,
					giftQuantity,
					qrCode2FAImagePath,
				);

			await giftCardsAdminPage.refresh();
			await giftCardsAdminPage
				.steps()
				.generateGiftCardFromGenerator(giftValue, giftQuantity);

			await initializePageObjectsWithCookies(
				await (await browser.newContext()).cookies(),
				initialPage,
				await createBrowserContextWithProxy(
					browser,
					PT_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await giftCardsAdminPage
				.steps()
				.navigateAndGenerateGiftCardWith2FaFlow(
					giftValue,
					giftQuantity,
					qrCode2FAImagePath,
				);
		},
	);
});
