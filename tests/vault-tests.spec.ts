import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { Unit } from "@enums/units";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const walletDataset = parse_csv(DATASETS_DIR, CsvFilesName.WALLET) as {
	wallet: string;
	unit: Unit;
}[];

test.describe("Vault navigation tests", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-2859] Vault Withdrawal - verify the Vault redirect",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
		async ({ homePage, walletModal }) => {
			await homePage.navigate();
			await homePage.clickWalletButton();
			await walletModal.steps().vaultRedirectedFromWithdrawTab();
		},
	);
});

walletDataset.forEach((record) => {
	test.describe(`Vault wallet tests: ${record.wallet}`, () => {
		test.use(
			storageStateNewUserDB({ unit: record.unit, amount: 5000000000 }),
		);
		test(
			`[ENG-2861] Vault - make a deposit from [${record.wallet}] wallet`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ homePage, walletModal }) => {
				await homePage.navigateToWallet();
				await walletModal
					.steps()
					.depositFromWalletAndVerify(record.wallet, record.unit);
			},
		);

		test(
			`[ENG-2860] Vault - make a withdrawal from [${record.wallet}] wallet`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ homePage, walletModal }) => {
				await homePage.navigateToWallet();
				await walletModal
					.steps()
					.withdrawFromVaultAndVerify(record.wallet, record.unit);
			},
		);
	});
});
