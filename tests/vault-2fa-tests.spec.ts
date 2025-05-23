import { UK_PROXY_CREDENTIALS } from "@constants/proxies";
import { MEDIUM_USER_AMOUNT } from "@constants/user-amounts";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
} from "@core/utils/utils";
import { Wallet } from "@enums/wallets";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

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

	test.use(storageStateNewUserDB({ amount: MEDIUM_USER_AMOUNT }));
	const walletType = Wallet.USD;
	const depositAmount = 3000;
	const withdrawAmount = depositAmount / 3;

	test(`[ENG-2566] Vault wallet - Require new 2FA code when IP of user changes`, async ({
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
			.depositFromWalletAndVerify(walletType, depositAmount);
		await walletModal
			.steps()
			.withdrawInVaultWith2FaFlow(
				walletType,
				withdrawAmount,
				qrCode2FAImagePath,
			);
		await walletModal.withdrawInVault(walletType, withdrawAmount);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

		await initializePageObjectsWithCookies(
			await (await browser.newContext()).cookies(),
			initialPage,
			await createBrowserContextWithProxy(browser, UK_PROXY_CREDENTIALS),
			...Object.values(pages),
		);

		await homePage.navigateToWallet();
		await walletModal.openVaultTab();
		await walletModal
			.steps()
			.withdrawInVaultWith2FaFlow(
				walletType,
				withdrawAmount,
				qrCode2FAImagePath,
			);
	});
});
