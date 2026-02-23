import { test } from "@fixtures/fixtures";
import { generateRandomString } from "@core/utils/utils";
import { ChatMessageOptions } from "@pages/components/chat/chat-map";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Chat - chatrooms tests",
	testDetails().withTags(JiraComponent.CHAT).apply(),
	() => {
		const message = generateRandomString({ prefix: "chatroom_auto_msg_" });

		test.afterEach(async ({ homePage }) => {
			await homePage.navigate({ cookies: { clearCookies: true } });
		});

		testData()
			.fromCsvRaw({ file: CsvFilesName.CHATROOM_SUCCESSFULLY_SELECTED })
			.forEach((input) => {
				test(
					`[ENG-2870] Chat - chatroom '${input.chatroom}' successfully selected with previous messages displayed`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({
						browserSessionManager,
						homePage,
						profilePage,
						chat,
					}) => {
						const regularUserSession =
							await browserSessionManager.loginAs(
								TestUserRole.REGULAR,
								{ reuseContext: true },
							);
						const messageInfo: ChatMessageOptions = {
							username:
								regularUserSession.getAuthenticatedUser().user
									.username,
							message: message,
						};

						await homePage.navigate();
						await chat.expandChat();
						await chat
							.steps()
							.selectChatroomSuccessfully(input.chatroom);
						await chat.steps().sendMessage(message);
						await chat.expandChat();
						await profilePage.navigate();
						await profilePage.steps().logout();
						await homePage.unauthenticatedHeader
							.assertThat()
							.loggedOutUserElementsAreVisible();
						await homePage.navigate();
						await chat.expandChat();
						//these last steps are not working anymore on v4 - still searching for the correct flow
						await chat
							.steps()
							.selectChatroomSuccessfully(input.chatroom);
						await chat.assertThat().isMessageVisible(messageInfo);
					},
				);
			});
	},
);
