import { BasePageStep } from "@pages/base/base-page-step";
import { CryptoAdminPage } from "./crypto-admin-page";
import { TransactionType } from "@enums/transaction-types";
import { CryptoNode } from "@enums/crypto-nodes";

export class CryptoAdminSteps extends BasePageStep<CryptoAdminPage> {
	public constructor(page: CryptoAdminPage) {
		super(page);
	}

	async setDepositOrWithdrawMin(
		action: TransactionType.DEPOSIT | TransactionType.WITHDRAWAL,
		node: CryptoNode,
		value = "0.00001",
	): Promise<void> {
		this.gamdomPage.acceptDialog({
			expectedMessage: "Enter new minimum",
			inputText: value,
			times: 2,
		});

		if (action === TransactionType.DEPOSIT) {
			await this.gamdomPage.clickMinDepositButton(node);
		} else {
			await this.gamdomPage.clickMinWithdrawButton(node);
		}
	}
}
