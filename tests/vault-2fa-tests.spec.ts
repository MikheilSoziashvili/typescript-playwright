import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { JiraUser } from "@enums/jira/jira-users";
import { Unit } from "@enums/units";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";
import { MEDIUM_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";

test.describe(`Vault wallet - 2FA verifications`, () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.fixme(isScheduledRun);
	test.use(storageStateNewUserDB({ amount: MEDIUM_USER_AMOUNT }));
	const testDataPredefined = testData()
		.fromPredefined()
		.pick({
			walletType: (data) => data.wallets.walletType,
			depositAmount: (data) => data.transactions.depositAmount,
			withdrawAmount: (data) => data.transactions.depositAmount / 3,
		});

	test(
		`[ENG-2566] Vault wallet - Require new 2FA code when IP of user changes`,
		testDetails()
			.withJiraBugTickets("5109")
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({
			browser,
			homePage,
			walletModal,
			settingsPage,
			twoFactorAuthModal,
		}) => {
			const pages = {
				homePage,
				walletModal,
				settingsPage,
				twoFactorAuthModal,
			};
			const initialPage = await initializePageObjects(
				await browser.newContext(),
				...Object.values(pages),
			);

			await homePage.navigateToWallet();
			await walletModal
				.steps()
				.depositFromWalletAndVerify(
					testDataPredefined.walletType,
					Unit.COINS,
					testDataPredefined.depositAmount,
				);
			await walletModal
				.steps()
				.withdrawInVaultWith2FaFlow(
					testDataPredefined.walletType,
					testDataPredefined.withdrawAmount,
					qrCode2FAImagePath,
				);
			await walletModal.withdrawInVault(
				testDataPredefined.walletType,
				testDataPredefined.withdrawAmount,
			);
			await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

			await initializePageObjectsWithCookies(
				await (await browser.newContext()).cookies(),
				initialPage,
				await createBrowserContextWithProxy(
					browser,
					PT_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await homePage.navigateToWallet();
			await walletModal.openVaultTab();
			await walletModal
				.steps()
				.withdrawInVaultWith2FaFlow(
					testDataPredefined.walletType,
					testDataPredefined.withdrawAmount,
					qrCode2FAImagePath,
				);
		},
	);
});
