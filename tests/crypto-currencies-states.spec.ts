import {
	ALL_USER_TYPES_DISABLED,
	ALL_USER_TYPES_ENABLED,
} from "@constants/feature-configurations";
import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { BrowserUserSession } from "@core/browser-session-mngmt";

test.describe(
	"Crypto currencies states and statuses tests",
	testDetails()
		.withTags(JiraComponent.CRYPTO, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test.describe("Crypto currencies states tests", () => {
			test.slow();
			testData()
				.fromCsvParsed({
					file: CsvFilesName.ENABLE_DISABLE_CRYPTO_CURRENCIES_STATUSES,
				})
				.forEach((record) => {
					test(
						`[ENG-10584] Enable/Disable crypto currencies - ${record.cryptoTicker} (Deposit: ${record.isDepositEnabled}, Withdrawal: ${record.isWithdrawalEnabled})`,
						testDetails()
							.withTags(TestTag.SEQUENTIAL)
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({
							browserSessionManager,
							cryptoAdminPage,
							walletModal,
							homePage,
						}) => {
							await browserSessionManager.loginAs(
								TestUserRole.ADMIN_CRYPTOSUPADMIN,
								{
									reuseContext: true,
								},
							);
							await cryptoAdminPage.navigate();
							await cryptoAdminPage.toggleCryptoOperations(
								record.cryptoCurrencies.map((crypto) => ({
									cryptoName: crypto,
									deposit: record.isDepositEnabled,
									withdraw: record.isWithdrawalEnabled,
								})),
							);

							await homePage.navigateToWallet();
							await walletModal
								.steps()
								.openWithdrawTabAndVerifyCryptoCurrencyPresence(
									record.cryptoTicker,
									record.isWithdrawalEnabled,
								);
							await walletModal
								.steps()
								.openDepositTabAndVerifyCryptoCurrencyPresence(
									record.cryptoTicker,
									record.isDepositEnabled,
								);

							await cryptoAdminPage
								.steps()
								.waitForCryptoProcessingIfNeeded(
									record.cryptoTicker,
								);
							await cryptoAdminPage.navigate();
							await cryptoAdminPage
								.assertThat()
								.cryptoOperationsToggleStatus(
									record.cryptoCurrencies.map((crypto) => ({
										cryptoName: crypto,
										deposit: record.isDepositEnabled,
										withdraw: record.isWithdrawalEnabled,
									})),
								);
						},
					);
				});
		});

		test.describe("Crypto currencies statuses tests", () => {
			let superAdmin: BrowserUserSession;

			test.beforeEach(async ({ browserSessionManager }) => {
				superAdmin = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{
						reuseContext: true,
					},
				);

				await (
					await superAdmin.apis.gamdomApi
				).setFeatureState(
					Feature.FIREBLOCKS_INTEGRATION,
					ALL_USER_TYPES_ENABLED,
				);
			});

			test.afterEach(async () => {
				await (
					await superAdmin.apis.gamdomApi
				).setFeatureState(
					Feature.FIREBLOCKS_INTEGRATION,
					ALL_USER_TYPES_ENABLED,
				);
			});

			test.slow();
			test(
				`[ENG-12151] Crypto currencies - status column state`,
				testDetails()
					.withTags(TestTag.SEQUENTIAL)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ cryptoAdminPage }, testInfo) => {
					const cryptos =
						testData().fromDomain().crypto
							.fireblocksIntegrationCryptos;
					await cryptoAdminPage.navigate();

					cryptos.forEach(async (crypto) => {
						await cryptoAdminPage
							.assertThat()
							.cryptoStatusToggleStatusState(crypto, false);
						await cryptoAdminPage
							.steps()
							.waitUntilCryptoStatusToggleState(
								crypto,
								true,
								testInfo,
							);
					});
					await (
						await superAdmin.apis.gamdomApi
					).setFeatureState(
						Feature.FIREBLOCKS_INTEGRATION,
						ALL_USER_TYPES_DISABLED,
					);
					await cryptoAdminPage.navigate();
					for (const crypto of cryptos) {
						await cryptoAdminPage
							.assertThat()
							.cryptoStatusToggleStatusState(crypto, false);
						await cryptoAdminPage
							.steps()
							.waitUntilCryptoStatusToggleState(
								crypto,
								false,
								testInfo,
							);
					}
				},
			);
		});
	},
);
