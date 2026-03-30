import { test } from "@fixtures/fixtures";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { USDT_ETH_CONFIG } from "@test-flows/crypto/types/crypto-flow-types";
import { CryptoOperationOptions } from "@core/types/types";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Streamer auto withdrawal review",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		test.slow();

		test.beforeEach(async ({ cryptoAdminSetupTestFlow }, testInfo) => {
			await cryptoAdminSetupTestFlow.setupCryptoOperations({
				testInfo: testInfo,
				operations: [
					{
						cryptoName: CryptoTicker.USDT,
						deposit: true,
						withdraw: true,
					},
				] as CryptoOperationOptions[],
				nodes: [CryptoNode.fireUSDT],
			});
		});

		test(
			"[ENG-4462][Crypto] Auto withdrawal rules for streamers",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ streamerWithdrawalReviewTestFlow }) => {
				await streamerWithdrawalReviewTestFlow.execute({
					config: USDT_ETH_CONFIG,
				});
			},
		);
	},
);
