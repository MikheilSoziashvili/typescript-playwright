import { BasePageStep } from "@pages/base/base-page-step";
import { CryptoAdminPage } from "./crypto-admin-page";
import { TransactionType } from "@enums/transaction-types";
import { TransactionState } from "@enums/transaction-states";
import { CryptoNode } from "@enums/crypto-nodes";
import { step } from "decorators/step";
import { pollOrSkip, waitForSeconds, waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Toast } from "@pages/components/toast/toast";
import { TestInfo } from "@playwright/test";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { GamdomApi } from "@api/gamdom-api";
import { logger } from "@logger/logger";

export class CryptoAdminSteps extends BasePageStep<CryptoAdminPage> {
	private readonly toast: Toast;

	public constructor(page: CryptoAdminPage) {
		super(page);
		this.toast = new Toast(this.gamdomPage.page);
	}

	@step("Set minimum deposit or withdraw")
	async setDepositOrWithdrawMin(
		action: TransactionType.DEPOSIT | TransactionType.WITHDRAWAL,
		nodeTitle: CryptoNode,
		value = "0.00001",
	): Promise<void> {
		this.gamdomPage.acceptDialog({
			expectedMessage: "Enter new minimum min",
			inputText: value,
			times: 2,
		});

		if (action === TransactionType.DEPOSIT) {
			await this.gamdomPage.clickMinDepositButton(nodeTitle);
		} else {
			await this.gamdomPage.clickMinWithdrawButton(nodeTitle);
		}
	}

	@step("Set maximum deposit or withdraw")
	public async setDepositOrWithdrawMax(
		action: TransactionType.DEPOSIT | TransactionType.WITHDRAWAL,
		nodeTitle: CryptoNode,
		value = "10000.00",
	): Promise<void> {
		this.gamdomPage.acceptDialog({
			expectedMessage: "Enter new minimum max",
			inputText: value,
			times: 2,
		});

		if (action === TransactionType.DEPOSIT) {
			await this.gamdomPage.clickMaxDepositButton(nodeTitle);
		} else {
			await this.gamdomPage.clickMaxWithdrawButton(nodeTitle);
		}
	}

	@step("Wait until crypto data is refreshed")
	public async waitUntilCryptoDataRefreshed(
		testInfo: TestInfo,
	): Promise<void> {
		await pollOrSkip(
			async () => {
				try {
					await this.toast.assertThat().titleIs(ToastTitle.SUCCESS, {
						subTitle: ToastSubTitle.REFRESHED_STATE,
					});
					return true;
				} catch {
					return false;
				}
			},
			{
				timeout: Timeout.EXTRA_LONG,
				interval: Timeout.EXTRA_SHORT,
				reason: "Crypto data table couldn't load in time",
				testInfo: testInfo,
			},
		);
	}

	@step("Set minimum deposit and withdraw")
	public async setMinDepositAndWithdraw(
		nodeTitle: CryptoNode,
		minDepositValue = "0.000001",
		minWithdrawValue = "0.000001",
	): Promise<void> {
		await this.setDepositOrWithdrawMin(
			TransactionType.DEPOSIT,
			nodeTitle,
			minDepositValue,
		);

		await this.setDepositOrWithdrawMin(
			TransactionType.WITHDRAWAL,
			nodeTitle,
			minWithdrawValue,
		);
	}

	@step("Set maximum deposit and withdraw")
	public async setMaxDepositAndWithdraw(
		nodeTitle: CryptoNode,
		maxDepositValue = "10000.00",
		maxWithdrawValue = "10000.00",
	): Promise<void> {
		await this.setDepositOrWithdrawMax(
			TransactionType.DEPOSIT,
			nodeTitle,
			maxDepositValue,
		);

		await this.setDepositOrWithdrawMax(
			TransactionType.WITHDRAWAL,
			nodeTitle,
			maxWithdrawValue,
		);
	}

	@step("Wait for crypto processing if needed")
	public async waitForCryptoProcessingIfNeeded(
		crypto: Cryptocurrency | CryptoTicker,
	): Promise<void> {
		if (crypto === Cryptocurrency.Bitcoin || crypto === CryptoTicker.BTC) {
			logger.info(
				`Waiting 30 seconds for ${crypto} processing to complete...`,
			);
			await waitForSeconds(30);
			logger.info(`${crypto} processing wait completed.`);
		} else {
			logger.info(
				`No wait needed for ${crypto} - proceeding immediately.`,
			);
		}
	}

	@step("Send queued withdrawals and wait for processing")
	public async sendQueuedAndWaitForProcessing(
		gamdomApi: GamdomApi,
		userId: number,
		username: string,
		adminCookie: string,
	): Promise<void> {
		await this.gamdomPage.sendQueuedWithdrawals();

		await waitUntil(
			async () => {
				const transactions =
					await gamdomApi.getCryptoAdminTransactions({
						cookie: adminCookie,
					});
				return !transactions.some(
					(tx) =>
						tx.user_id === userId &&
						tx.type ===
							TransactionType.WITHDRAWAL.toLowerCase() &&
						tx.state ===
							TransactionState.QUEUED.toLowerCase(),
				);
			},
			{
				errorMessage: `Withdrawal for user "${username}" remained in queued status`,
			},
		);

	}

	@step("Wait until crypto status toggle reaches expected state")
	public async waitUntilCryptoStatusToggleState(
		cryptoName: Cryptocurrency | CryptoTicker,
		expectedStatus: boolean,
		testInfo: TestInfo,
	): Promise<void> {
		await pollOrSkip(
			async () => {
				try {
					await this.gamdomPage
						.assertThat()
						.cryptoStatusToggleStatus(cryptoName, expectedStatus);
					return true;
				} catch {
					return false;
				}
			},
			{
				timeout: Timeout.EXTRA_LONG,
				interval: Timeout.EXTRA_SHORT,
				reason: `Crypto status toggle for ${cryptoName} did not reach expected state (${expectedStatus ? "checked" : "unchecked"}) in time`,
				testInfo: testInfo,
			},
		);
	}
}
