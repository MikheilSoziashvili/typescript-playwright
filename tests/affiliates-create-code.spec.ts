import { buildCreateAffiliateCodeSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { generateRandomString } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Create affiliate code", () => {
	test.beforeEach(async ({ gamdomApiActions }) => {
		const user_register_data = new RegisterTestData();
		await gamdomApiActions.authenticateWithNewUser(user_register_data);
	});

	test("[ENG-1135] Create an affiliate code", async ({
		affiliatesPage,
		toast,
	}) => {
		await affiliatesPage.navigate();
		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: buildCreateAffiliateCodeSubTitle(
				AUTOMATION_AFFILIATES_CODE,
			),
		});
	});
});
