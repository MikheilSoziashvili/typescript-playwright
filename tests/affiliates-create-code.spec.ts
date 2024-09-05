import { buildCreateAffiliateCodeSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { generateRandomString } from "@core/utils/utils";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Create affiliate code", () => {
	test.use(storageStateNewUserAPI());
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
