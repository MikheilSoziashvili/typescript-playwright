import { buildCreateAffiliateCodeSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import { generateRandomString } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Create affiliate code", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-1135] Create an affiliate code",
		testDetails()
			.withTags(JiraComponent.AFFILIATES)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ affiliatesPage, toast }) => {
			await affiliatesPage.navigate();
			await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);
			await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
				subTitle: buildCreateAffiliateCodeSubTitle(
					AUTOMATION_AFFILIATES_CODE,
				),
			});
		},
	);
});
