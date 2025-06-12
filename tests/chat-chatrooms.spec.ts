import { test } from "@fixtures/fixtures";
import {
	generateRandomString,
	parse_csv,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ChatMessageOptions } from "@pages/components/chat/chat-map";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "@enums/csv-file-name";

const chatroomInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.CHATROOM_SUCCESSFULLY_SELECTED,
) as {
	chatroom: string;
}[];

test.describe(
	"Chat - chatrooms tests",
	{
		tag: "@chat",
	},
	() => {
		const userData = new RegisterTestData();
		const message = generateRandomString({ prefix: "chatroom_auto_msg_" });
		const messageInfo: ChatMessageOptions = {
			username: userData.username,
			message: message,
		};

		test.beforeAll(async ({ gamdomDb }) => {
			await gamdomDb.createNewUser({
				username: userData.username,
				password: userData.password,
				email: userData.email,
				emailVerified: true,
			});
		});

		test.beforeEach(async ({ gamdomApi, page }) => {
			const cookie = await gamdomApi.authenticateWithExistingUser(
				userData.username,
				userData.password,
			);
			await setAuthenticationCookies(page, cookie);
		});

		test.afterEach(async ({ homePage }) => {
			await homePage.navigate({ cookies: { clearCookies: true } });
		});

		chatroomInputs.forEach((input) => {
			test(`[ENG-2870] Chat - chatroom '${input.chatroom}' successfully selected with previous messages displayed`, async ({
				homePage,
				profilePage,
				chat,
			}) => {
				await homePage.navigate();
				await chat.steps().openChatAndVerify();
				await chat.steps().selectChatroomSuccessfully(input.chatroom);
				await chat.steps().sendMessage(message);
				await profilePage.navigate();
				await profilePage.logout();
				await homePage.unauthenticatedHeader
					.assertThat()
					.loggedOutUserElementsAreVisible();
				await homePage.navigate();
				await chat.steps().openChatAndVerify();
				await chat.steps().selectChatroomSuccessfully(input.chatroom);
				await chat.assertThat().isMessageVisible(messageInfo);
			});
		});
	},
);
