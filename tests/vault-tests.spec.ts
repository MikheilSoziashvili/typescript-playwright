import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { formatCurrency, parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { Currency } from "@enums/currencies";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { Locale } from "@enums/locale";
import { SelfExclusionDays } from "@enums/self-exlusion-days";
import { Unit } from "@enums/units";
import { Wallet } from "@enums/wallets";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const walletDataset = parse_csv(DATASETS_DIR, CsvFilesName.WALLET) as {
	wallet: string;
	unit: Unit;
}[];

test.describe(
	"Vault tests",
	testDetails().withTags(JiraComponent.VAULT).apply(),
	() => {
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

			test(
				"[ENG-3108] Vault - access Vault during self exclusion",
				testDetails()
					.withAuthor(JiraUser.ANGEL_PETROV)
					.withTags(JiraComponent.SELF_EXCLUSION)
					.apply(),
				async ({
					homePage,
					walletModal,
					settingsPage,
					testDataPredefined,
				}) => {
					const amountToWithdraw =
						testDataPredefined.data.vault.amountToWithdraw;

					const formattedAmount = formatCurrency(
						amountToWithdraw,
						Locale.EN_US,
						Currency.USD,
						2,
					);

					await settingsPage
						.steps()
						.navigateAndEnableSelfExclusion(
							SelfExclusionDays.FIVE_DAYS,
						);
					await homePage.navigateToWallet();
					await walletModal
						.steps()
						.depositFromWalletAndVerify(Wallet.USD, Unit.COINS);
					await walletModal.withdrawInVault(
						Wallet.USD,
						amountToWithdraw,
					);
					await walletModal
						.assertThat()
						.vaultWithdrawToastMessageIsDisplayed(formattedAmount);
				},
			);
		});

		walletDataset.forEach((record) => {
			test.describe(`Vault wallet tests: ${record.wallet}`, () => {
				test.use(
					storageStateNewUserDB({
						unit: record.unit,
						amount: 5000000000,
					}),
				);

				test(
					`[ENG-2861] Vault - make a deposit from [${record.wallet}] wallet`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({ homePage, walletModal }) => {
						await homePage.navigateToWallet();
						await walletModal
							.steps()
							.depositFromWalletAndVerify(
								record.wallet,
								record.unit,
							);
					},
				);

				test(
					`[ENG-2860] Vault - make a withdrawal from [${record.wallet}] wallet`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({ homePage, walletModal }) => {
						await homePage.navigateToWallet();
						await walletModal
							.steps()
							.withdrawFromVaultAndVerify(
								record.wallet,
								record.unit,
							);
					},
				);
			});
		});
	},
);
