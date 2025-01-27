import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
} from "@core/utils/utils";
import { Wallet } from "@enums/wallets";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(`Vault wallet - 2FA verifications`, () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserAPI({ amount: 45000000 }));
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
		let context = await browser.newContext({});
		const pages = {
			homePage,
			walletModal,
			settingsPage,
			twoFactorAuthModal,
		};
		const initialPage = await initializePageObjects(
			context,
			...Object.values(pages),
		);

		await homePage.navigateToWallet();
		await walletModal
			.steps()
			.depositFromWalletAndVerify(walletType, depositAmount);
		await walletModal.withdrawInVault(walletType, withdrawAmount);
		const code2FA = await settingsPage.generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		await twoFactorAuthModal.steps().enter2FaCodeSuccessfully(code2FA);
		await walletModal.withdrawInVault(walletType, withdrawAmount);
		await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

		const cookies = await context.cookies();
		context = await browser.newContext({
			proxy: NL_PROXY_CREDENTIALS,
		});
		await context.addCookies(cookies);
		await initialPage.close();
		await initializePageObjects(context, ...Object.values(pages));

		await homePage.navigateToWallet();
		await walletModal.openVaultTab();
		await walletModal.withdrawInVault(walletType, withdrawAmount);
		const newCode2FA = await settingsPage.generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		await twoFactorAuthModal.steps().enter2FaCodeSuccessfully(newCode2FA);
	});
});
