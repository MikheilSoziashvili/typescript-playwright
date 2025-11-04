import { BasePageStep } from "@pages/base/base-page-step";
import { CryptoAdminPage } from "./crypto-admin-page";
import { TransactionType } from "@enums/transaction-types";
import { CryptoNode } from "@enums/crypto-nodes";
import { step } from "decorators/step";
import { pollOrSkip } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Toast } from "@pages/components/toast/toast";
import { TestInfo } from "@playwright/test";

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
		currency?: string,
		value = "0.00001",
	): Promise<void> {
		this.gamdomPage.acceptDialog({
			expectedMessage: "Enter new minimum",
			inputText: value,
			times: 2,
		});

		if (action === TransactionType.DEPOSIT) {
			await this.gamdomPage.clickMinDepositButton(nodeTitle, currency);
		} else {
			await this.gamdomPage.clickMinWithdrawButton(nodeTitle, currency);
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
		currency: string,
		minDepositValue = "0.00001",
		minWithdrawValue = "0.00001",
	): Promise<void> {
		await this.setDepositOrWithdrawMin(
			TransactionType.DEPOSIT,
			nodeTitle,
			currency,
			minDepositValue,
		);

		await this.setDepositOrWithdrawMin(
			TransactionType.WITHDRAWAL,
			nodeTitle,
			currency,
			minWithdrawValue,
		);
	}
}
