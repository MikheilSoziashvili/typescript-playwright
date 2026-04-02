import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Profile Transactions — Gift Card deposit details modal", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ browserSessionManager }) => {
		const superadmin = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{
				reuseContext: true,
			},
		);
		qrCode2FAImagePath = createPngImagePath();
		await superadmin.pages.settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
	});

	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test(
		"[ENG-14886] Gift Cards — Fiat Deposit modal shows correct transaction details",
		testDetails()
			.withAuthor(JiraUser.RALUCA_ARITON)
			.withTags(
				JiraComponent.GIFTCARDS,
				JiraComponent.PROFILE,
				JiraComponent.TRANSACTIONS,
				TestTag.ACCEPTANCE,
			)
			.apply(),
		async ({ giftCardsAdminPage, giftCardTransactionScenarioFlow }) => {
			const giftCardData = testData().fromPredefined().data.giftCards;
			const giftCardCode = await giftCardsAdminPage
				.steps()
				.navigateAndGenerateGiftCardWith2FaFlowAndGetFirstCode(
					giftCardData.defaultValue,
					giftCardData.defaultQuantity,
					qrCode2FAImagePath,
				);

			await giftCardTransactionScenarioFlow.execute({ giftCardCode });
		},
	);
});
