import { BaseAsserter } from "@pages/base/base-asserter";
import { WalletModal } from "./wallet-modal";
import { Timeout } from "@enums/timeout";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { parseToFloat } from "@core/utils/utils";

export class WalletModalAsserter extends BaseAsserter<WalletModal> {
	public constructor(page: WalletModal) {
		super(page);
	}

	@step()
	async vaultTabHeadingIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.vaultTabHeading],
			Timeout.SHORT,
		);
	}

	@step()
	public async vaultWalletAmountIs(expectedAmount: number): Promise<void> {
		const amountText = await this.gamdomPage.getVaultWalletAmount();
		const actualAmount = parseToFloat(parseFloat(amountText));
		const roundedExpectedAmount = parseToFloat(expectedAmount);

		expect(actualAmount).toBe(roundedExpectedAmount);
	}

	@step()
	public async vaultDepositToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultDepositToastMessage,
		).toContainText(
			`${amount} has been transferred from your Wallet to your Vault`,
		);
	}

	@step()
	public async vaultWithdrawToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultWithdrawToastMessage,
		).toContainText(
			`${amount} has been transferred from your Vault to your Wallet`,
		);
	}
}
