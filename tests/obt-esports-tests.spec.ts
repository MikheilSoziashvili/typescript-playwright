import { test } from "@fixtures/fixtures";
import { EsportsSidebarSection } from "@enums/esports-sidebar-sections";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { isScheduledRun } from "configuration";
import { TestTag } from "@enums/test-tags";

test.describe("OBT E-Sports tests", () => {
	testData()
		.fromCsvParsed({
			file: CsvFilesName.OBT_ESPORTS_PAGES_STATUS_CODE,
		})
		.forEach((record) => {
			test(
				`[ENG-4830] Verify OBT E-Sports '${record.esportSidebarItemName}' page is loaded successfully and 'Success' status code is returned`,
				testDetails()
					.withTags(
						JiraComponent.SEO,
						JiraComponent.SPORTS_ESPORTS_BETTING, TestTag.ACCEPTANCE)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.apply(),
				async ({ esportsPage }) => {
					test.fixme(
						isScheduledRun,
						"OBT servers are disabled after working hours due to OBT team rule and we can not test them in nightly runs.",
					);
					await esportsPage.navigate();
					await esportsPage.assertThat().pageElementsAreVisible();
					await esportsPage
						.steps()
						.expandSidebarSectionSuccessfully(
							EsportsSidebarSection.ALL_ESPORTS,
						);

					const responsePromise =
						esportsPage.waitForEntidadResponse();
					await esportsPage
						.steps()
						.clickSidebarSectionItemSuccessfully(
							EsportsSidebarSection.ALL_ESPORTS,
							record.esportSidebarItemName,
						);

					await esportsPage
						.assertThat()
						.waitForAndVerifyCurrentUrlIs(record.esportsPageEndfix);
					await esportsPage
						.getApiAsserter()
						.assertResponseStatus(await responsePromise);
				},
			);
		});
});
