import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"KYC Verification",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		verificationTestData.level1VerificationScenarios.forEach(
			({
				testId,
				formType,
				fillSubmissionForm,
				expectedNotificationTitle,
				expectedNotificationSubTitle,
				expectedToastTitle,
				expectedToastSubTitle,
			}) => {
				test(
					`[${testId}] Submit ${formType} Level 1`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({
						page,
						gamdomApiDbFacade,
						homePage,
						verificationPage,
						toast,
					}) => {
						const { cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth();
						await setAuthenticationCookies(page, cookie);

						await verificationPage.navigate();
						await verificationPage
							.assertThat()
							.verificationPageTitleAndTabsAreVisible();

						await fillSubmissionForm(verificationPage.steps());

						const notification = homePage.getNotification();
						await notification
							.assertThat()
							.titleIs(expectedNotificationTitle);
						await notification
							.assertThat()
							.subTitleIs(expectedNotificationSubTitle);

						await toast.assertThat().titleIs(expectedToastTitle);
						await toast
							.assertThat()
							.subTitleIs(expectedToastSubTitle);
					},
				);
			},
		);
	},
);
