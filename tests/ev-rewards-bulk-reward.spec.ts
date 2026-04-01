import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"EV Rewards - bulkReward API",
	testDetails()
		.withTags(JiraComponent.REWARDS, JiraComponent.EV, TestTag.ACCEPTANCE)
		.apply(),
	() => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.SEND_WEEKLY_MONTHLY_REWARD,
			})
			.forEach((record) => {
				test(
					`[ENG-9882] Send ${record.rewardType} bulkReward successfully`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ evRewardsBulkRewardScenarioTestFlow }) => {
						const regularUser =
							await evRewardsBulkRewardScenarioTestFlow.setupBulkReward(
								record.rewardType,
							);
						await evRewardsBulkRewardScenarioTestFlow.verifyAndClaimReward(
							{
								regularUser: regularUser,
								rewardType: record.rewardType,
							},
						);
					},
				);

				test(
					`[ENG-9882] Can not send ${record.rewardType} bulkReward when userId is missing`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ evRewardsBulkRewardScenarioTestFlow }) => {
						await evRewardsBulkRewardScenarioTestFlow.executeBulkRewardWithMissingUserId(
							record.rewardType,
						);
					},
				);
			});
	},
);
