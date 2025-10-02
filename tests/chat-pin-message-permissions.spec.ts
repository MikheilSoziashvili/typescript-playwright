import { test } from "@fixtures/fixtures";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { UserTags } from "@enums/db/user-tags";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ChatMessageOptions } from "@pages/components/chat/chat-map";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Chat - pin, unpin and check permissions",
	testDetails().withTags(TestTag.SEQUENTIAL, JiraComponent.CHAT).apply(),
	() => {
		testData()
			.fromCsvParsed({ file: CsvFilesName.CHAT_PIN_UNPIN })
			.forEach((record) => {
				test(
					`[ENG-7196] [Chat] Check unpin pinned message permission changes with class ${record.Userclass} and tag ${record.Usertag}`,
					testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
					async ({
						gamdomApiDbFacade,
						userInfoAdminPage,
						userInfoEditInfoAdminPage,
						homePage,
						chat,
						page,
						testDataPredefinedRandom,
						toast,
					}) => {
						const {
							user: superAdminUser,
							cookie: superAdminCookie,
						} =
							await gamdomApiDbFacade.createSuperAdminUserDbAndAuth(
								{
									emailVerified: true,
								},
							);
						await setAuthenticationCookies(page, superAdminCookie);

						const message =
							testDataPredefinedRandom.data.chatMessages
								.pinnedMessage;

						const messageInfo: ChatMessageOptions = {
							username: superAdminUser.username,
							message: message,
						};

						await homePage.navigateAndExpandChat();
						await chat
							.steps()
							.sendMessageAndVerifyItsVisible(
								message,
								messageInfo,
							);

						await chat.steps().pinMessage(messageInfo);
						await chat
							.assertThat()
							.isPinnedMessageVisible(messageInfo);

						const { user, cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth({
								emailVerified: true,
								userClass: record.Userclass,
								tags: record.Usertag,
							});
						await userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(user.username);
						await userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.EditInfo,
						);

						await userInfoEditInfoAdminPage.toggleTag(
							UserTags.ChatUnpinMessage,
						);
						await userInfoEditInfoAdminPage
							.assertThat()
							.verifyTagsAreChecked(
								[UserTags.ChatUnpinMessage],
								true,
							);
						await userInfoEditInfoAdminPage.clickSaveButton();
						await toast.assertThat().titleIs(record.Message);

						await homePage.navigate({
							cookies: { clearCookies: true },
						});
						await setAuthenticationCookies(page, cookie);
						await homePage.navigateAndExpandChat();
						await chat.assertThat().chatIsDisplayed();
						await chat.steps().unpinMessage(messageInfo);
					},
				);
			});
	},
);
