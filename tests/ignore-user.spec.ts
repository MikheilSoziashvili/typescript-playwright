import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe(
	`"Ignore" user from the chat`,
	testDetails().withTags(JiraComponent.CHAT, JiraComponent.PRIVACY).apply(),
	() => {
		test(
			`[ENG-11852] Ignoring an user`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ chatIgnoreUserScenarioFlow }) => {
				await chatIgnoreUserScenarioFlow.ignoreUserFromChatMenuAndVerify();
			},
		);

		test(
			`[ENG-11852] Changing an ignored user's username`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ chatIgnoreUserScenarioFlow }) => {
				await chatIgnoreUserScenarioFlow.ignoreUserAndVerifyAfterUsernameChange();
			},
		);

		test(
			`[ENG-11852] Ignoring a user from the chat by clicking their avatar`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ chatIgnoreUserScenarioFlow }) => {
				await chatIgnoreUserScenarioFlow.ignoreUserViaAvatarClickAndVerify();
			},
		);

		test(
			`[ENG-11852] Unignoring an ignored user`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ chatIgnoreUserScenarioFlow }) => {
				await chatIgnoreUserScenarioFlow.unignoreUserAndVerify();
			},
		);
	},
);
