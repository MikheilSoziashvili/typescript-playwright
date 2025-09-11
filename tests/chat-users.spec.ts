import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { ChatMessageOptions } from "@pages/components/chat/chat-map";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Chat - users tests",
	testDetails()
		.withTags(JiraComponent.CHAT, JiraComponent.VIP_MANAGER)
		.apply(),
	() => {

		testData()
			.fromCsvRaw({ file: CsvFilesName.VIP_USER_STATUS })
			.forEach((input) => {
				test(
					`[ENG-6827] Chat - Verify diamond icon for user '${input.vipUserStatus}'`,
					testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
					async ({
						gamdomApiDbFacade,
						gamdomDb,
						page,
						homePage,
						chat,
					}) => {
						const { user, cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth({
								userClass: UserClasses.User,
								emailVerified: true,
							});

						const message = generateRandomString({
							prefix: `chat_auto_msg_${user.userId}_`,
						});

						const messageInfo: ChatMessageOptions = {
							username: user.username,
							message: message,
						};

						const [createdVipUser] = await gamdomApiDbFacade.createUsersDb({
						  usersCount: 1,
						  userClass: UserClasses.Admin,
						  tags: UserTags.VipManagerAdmin,
						});
						const vipUserId = createdVipUser.userId;

						await gamdomDb.insertVipUser(
							user.userId,
							vipUserId,
							input.vipUserStatus,
						);

						await setAuthenticationCookies(page, cookie);

						await homePage.navigate();
						await chat.steps().openChatAndVerify();
						await chat.steps().sendMessage(message);
						await chat
							.assertThat()
							.vipDiamondIsVisibleForMessageAuthor(
								messageInfo,
								input.vipUserStatus,
							);
					},
				);
			});
	},
);
