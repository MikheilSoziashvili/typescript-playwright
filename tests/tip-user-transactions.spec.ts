import { test } from "@fixtures/fixtures";
import { ChatMessageOptions } from "@components/chat/chat-map";
import {
	encodeCookieHeader,
	generateRandomString,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { ToastTitle } from "@enums/toast-titles";
import {
	buildTipUserMessageInfo,
	buildTipUserSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";
import { HomePage } from "@pages/home-page/home-page";
import { Chat } from "@pages/components/chat/chat";
import { UserData } from "@core/facades/gamdom-api-db/interfaces";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { TransactionsPage } from "@pages/transactions/transactions-page";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Tip user transactions",
	testDetails()
		.withTags(JiraComponent.CHAT, JiraComponent.TRANSACTIONS)
		.apply(),
	() => {
		let user1: UserData;
		let user2: UserData;
		const tipValue = 10;

		test(
			"[ENG-7556] Check sent and received tips in Transactions",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				homePage,
				gamdomApi,
				chat,
				tipUserModal,
				toast,
				page,
				gamdomApiDbFacade,
				browser,
				userBalanceHandler,
				transactionsPage,
			}) => {
				//Create 2 test users at once
				const users = await gamdomApiDbFacade.createUsersDb({
					usersCount: 2,
					emailVerified: true,
					wagered: 45000,
				});

				[user1, user2] = users;

				//Authenticate with User 2 and send a message in the chat
				const user2Cookie =
					await gamdomApi.authenticateWithExistingUser(
						user2.username,
						user2.password,
					);

				const headersUser2 = {
					Cookie: await encodeCookieHeader(user2Cookie),
				};

				const user2Context = await browser.newContext();
				const user2Page = await user2Context.newPage();
				await setAuthenticationCookies(user2Page, user2Cookie);

				const user2HomePage = new HomePage(user2Page);
				const user2Chat = new Chat(user2Page);
				const user2BalanceHandler = new UserBalanceHandler(user2Page);
				const user2TransactionsPage = new TransactionsPage(user2Page);

				await user2HomePage.navigate();
				await user2Chat.expandChat();

				const message_1 = generateRandomString({
					prefix: "automation_message_",
				});
				const messageInfo_1: ChatMessageOptions = {
					username: user2.username,
					message: message_1,
				};

				await user2Chat.steps().sendMessage(message_1);
				// need to send second message as a workaround until bug DEV-1919 is fixed by dev team
				const message_2 = generateRandomString({
					prefix: "automation_message_",
				});
				await user2Chat.steps().sendMessage(message_2);

				const user2AccountBalance =
					await user2BalanceHandler.walletBalanceInFiatRounded(
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
						headersUser2,
					);

				//Authenticate with User 1 and tip User 2
				const user1Cookie =
					await gamdomApi.authenticateWithExistingUser(
						user1.username,
						user1.password,
					);

				const headersUser1 = {
					Cookie: await encodeCookieHeader(user1Cookie),
				};
				await setAuthenticationCookies(page, user1Cookie);

				await homePage.navigate();
				await chat.expandChat();
				await chat
					.steps()
					.verifyChatIsDisplayedAndMessageIsVisible(messageInfo_1);

				const user1AccountBalance =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
						headersUser1,
					);

				await chat.steps().openTipUserModal(messageInfo_1);

				await tipUserModal.steps().tipUser(tipValue);

				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast.assertThat().subTitleIs(
					buildTipUserSubTitle({
						username: messageInfo_1.username,
						tipAmount: tipValue,
					}),
				);

				await chat.assertThat().isInfoMessageVisible(
					buildTipUserMessageInfo({
						senderUsername: user1.username,
						receiverUsername: user2.username,
						tipAmount: tipValue,
					}),
					user1.username,
				);

				//Verify User 1's account balance
				await homePage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(
						user1AccountBalance - Number(tipValue),
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
						headersUser1,
					);

				//Authenticate with User 2 and verify balance is updated
				await user2HomePage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(
						user2AccountBalance + Number(tipValue),
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
						headersUser2,
					);

				//Navigate to Transactions Page and verify tip details for user 1
				await transactionsPage.navigate();

				await transactionsPage.openTipsTab();
				await transactionsPage
					.steps()
					.verifyTipSentTransactionDetails(tipValue, user2.username);

				//Navigate to Transactions Page and verify tip details for user 2
				await user2TransactionsPage.navigate();

				await user2TransactionsPage.openTipsTab();
				await user2TransactionsPage
					.steps()
					.verifyTipReceivedTransactionDetails(
						tipValue,
						user1.username,
					);
			},
		);
	},
);
