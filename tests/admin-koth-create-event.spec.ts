import { test } from "@fixtures/fixtures";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { generateRandomString } from "@core/utils/utils";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { KothMaxWinners } from "@enums/admin/koth-max-winners";

test.describe(
	"Create KOTH Event",
	testDetails().withTags(JiraComponent.ADMIN, JiraComponent.KOTH).apply(),
	() => {
		test.use(storageStateNewSuperAdminUserDB());
		test(
			`[ENG-7865] Admin - Create KOTH event`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ kothAdminPage, toast }) => {
				const endDateOffset = 1;
				const prize = 100;
				const maxWinners = KothMaxWinners.ONE;
				const eventName = generateRandomString({
					prefix: "KOTH_automation_event_",
					length: 3,
				});
				await kothAdminPage.navigate();
				await kothAdminPage
					.steps()
					.startNewKothEvent(
						endDateOffset,
						prize,
						eventName,
						maxWinners,
					);

				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.KOTH_EVENT_CREATED);

				await kothAdminPage
					.assertThat()
					.kothEventNameIsPresentInActiveEvents(eventName);
				await kothAdminPage
					.assertThat()
					.kothEventPrizeAmountIsPresentInActiveEvents(
						eventName,
						prize,
					);
				await kothAdminPage
					.assertThat()
					.kothEventMaxWinnersIsPresentInActiveEvents(
						eventName,
						maxWinners,
					);
				await kothAdminPage
					.assertThat()
					.kothEventEndDateIsPresentInActiveEvents(
						eventName,
						endDateOffset,
					);
			},
		);
	},
);
