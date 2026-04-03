import { testDetails } from "@core/helpers/test-details-helper";
import { PromotionEndDateTimeFormatCsvRecord } from "@dtos/csv";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

const promotionEndDateScenarios: PromotionEndDateTimeFormatCsvRecord[] =
	testData().fromCsvRaw({
		file: CsvFilesName.PROMOTION_END_DATE_TIME_FORMAT,
	});

test.describe(
	"Promotion end date and time format tests",
	testDetails().withTags(JiraComponent.PROMOTIONS).apply(),
	() => {
		let promotionsToDelete: string[] = [];

		test.afterEach(async ({ gamdomDb }) => {
			await gamdomDb.deletePromotionByTitle(promotionsToDelete);
			promotionsToDelete = [];
		});

		promotionEndDateScenarios.forEach((scenario) => {
			test(
				`[ENG-11539] Verify End date and time format on ${scenario.promotionStatus} promotion card and details page`,
				testDetails()
					.withAuthor(JiraUser.NIKOLAY_GENOV)
					.withTags(TestTag.ACCEPTANCE)
					.apply(),
				async ({
					browserSessionManager,
					promotionEndDateSetupFlow,
				}) => {
					const { promotionName, expectedFormat } =
						await promotionEndDateSetupFlow.setupPromotionForEndDateVerification(
							{
								promotionStatus: scenario.promotionStatus,
								promotionsToDelete: promotionsToDelete,
							},
						);

					const regularUser = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
					);

					await regularUser.pages.promotionsPage
						.steps()
						.navigateAndVerifyPageIsLoaded();
					await regularUser.pages.promotionsPage
						.assertThat()
						.promotionCardIsDisplayedWithEndDateFormat(
							promotionName,
							expectedFormat,
						);

					await regularUser.pages.promotionsPage.clickPromotionCard(
						promotionName,
					);
					await regularUser.pages.promotionPage
						.assertThat()
						.promotionDetailsPageIsLoadedWithEndDateFormat(
							expectedFormat,
						);
				},
			);
		});
	},
);
