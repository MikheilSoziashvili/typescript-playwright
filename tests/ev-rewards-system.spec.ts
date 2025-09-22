import { testDetails } from "@core/helpers/test-details-helper";
import { FileKey } from "@core/types/types";
import { buildRewardCsvVariants } from "@core/utils/generating-reward-csv-utils";
import { parseRelativeDateRelation } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { Currency } from "@enums/currencies";
import { ExpectedResultLogsKey } from "@enums/expected-reward-logs";
import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";

test.describe(
	"EV Rewards system tests",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test.describe.configure({ mode: "default" });

		test.use(
			storageStateNewSuperAdminUserDB({
				amount: SUPER_HIGH_USER_AMOUNT,
			}),
		);

		let rewardUserIds: string[] = [];
		let dynamicFileMap: Partial<Record<FileKey, string>> = {};

		test.beforeAll(async ({ gamdomApiDbFacade }) => {
			const created = await gamdomApiDbFacade.createUsersDb({
				usersCount: 1000,
			});
			rewardUserIds = created.map((u) => String(u.userId));

			dynamicFileMap = buildRewardCsvVariants({
				ids: rewardUserIds,
			});
		});

		testData()
			.fromCsvRaw({ file: CsvFilesName.EV_REWARD_FREE_SPINS_PROMOTION })
			.forEach((input) => {
				test(
					`[ENG-7499] Granting free spins promotion reward for case '${input.iterationName}'`,
					testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
					async ({
						evRewardsSystemAdminPage,
						userBalanceHandler,
					}) => {
						await evRewardsSystemAdminPage
							.steps()
							.navigateAndCheckRewardTypeElements();

						const balanceBefore =
							await userBalanceHandler.walletBalanceInFiatRounded(
								Unit.COINS,
								Currency.USD,
								WalletType.DEFAULT,
							);

						await evRewardsSystemAdminPage
							.steps()
							.selectFreeSpinsAndCheckElements();

						await evRewardsSystemAdminPage
							.steps()
							.pickDatesByRelations(
								parseRelativeDateRelation(input.startDate),
								parseRelativeDateRelation(input.endDate),
							);

						const uploadPath = await evRewardsSystemAdminPage
							.steps()
							.resolveUploadPath(
								input.fileKey as FileKey,
								dynamicFileMap,
							);
						await evRewardsSystemAdminPage.bulkRewardFileUpload(
							uploadPath,
						);
						await evRewardsSystemAdminPage.clickRewardUsersButton();

						const resultKey =
							input.expectedResult as ExpectedResultToastKey;
						await evRewardsSystemAdminPage
							.assertThat()
							.expectToastByFileKey(
								resultKey,
								input.fileKey as FileKey,
							);

						await evRewardsSystemAdminPage
							.assertThat()
							.assertLogs(
								input.expectedLogs as ExpectedResultLogsKey,
							);

						const csvPayout = await evRewardsSystemAdminPage
							.steps()
							.computePayoutForCase(uploadPath, resultKey);

						const balanceAfter =
							await userBalanceHandler.walletBalanceInFiatRounded(
								Unit.COINS,
								Currency.USD,
								WalletType.DEFAULT,
							);

						const shouldDeduct = await evRewardsSystemAdminPage
							.steps()
							.shouldDeductBalance(resultKey);

						logger.info(
							`Balance before: ${balanceBefore}, Payout: ${csvPayout}, Balance after: ${balanceAfter}`,
						);

						await evRewardsSystemAdminPage
							.assertThat()
							.finalBalanceIsCorrect(
								balanceBefore,
								csvPayout,
								balanceAfter,
								shouldDeduct,
							);
					},
				);
			});
	},
);
