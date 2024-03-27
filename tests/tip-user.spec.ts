import { test } from "../fixtures/fixtures";
import { storageStateUser1 } from "../fixtures/auth-fixtures";

test.describe("Tip user tests", () => {
	test.use(storageStateUser1);
	test("Tip user @smoke", async ({ homePage, chat }) => {
		await homePage.navigate();

		await chat.waitChatToBeDisplayed();
		await chat.assertThat().isDisplayed();

		await chat
			.steps()
			.openTipUserModal({ username: "superadmin", message: "test5" });
	});
});
