import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { isCI } from "configuration";
import { testData } from "test-data/test-data-manager";

test.describe(
	"[ENG-12432] Redesign V4 - Feature activation matrix",
	testDetails()
		.withTags(JiraComponent.FEATURES, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test.fixme(
			isCI,
			"Disabled because the test takes more than 1 hour and will be run locally on demand",
		);
		testData()
			.fromCsvParsed({ file: CsvFilesName.FEATURE_ACTIVATION_V4 })
			.forEach((record) => {
				test(
					`[ENG-12432] Redesign V4 enabled for [${record.userType}], login as [${record.loginUserTag}]`,
					testDetails()
						.withTags(TestTag.SEQUENTIAL)
						.withAuthor(JiraUser.NIKOLAY_GENOV)
						.apply(),
					async ({
						browserSessionManager,
						featureActivationV4TestFlow,
					}) => {
						const superAdmin = await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
						);
						await (
							await superAdmin.apis.gamdomApi
						).setFeatureState(
							Feature.NEW_DESIGN_V4,
							record.enabledUserTypes,
						);

						await featureActivationV4TestFlow.verifyV4ActivationState(
							{
								v4BeforeLogin: record.v4BeforeLogin,
								v4AfterLogin: record.v4AfterLogin,
								loginTags: record.loginTags,
							},
						);
					},
				);
			});
	},
);
