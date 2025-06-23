import { BaseAsserter } from "@pages/base/base-asserter";
import { WalletModal } from "./wallet-modal";
import { Timeout } from "@enums/timeout";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

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
	public async vaultWalletAmountIs(
		expectedUsd: number,
		unit: Unit,
	): Promise<void> {
		const backendUsd = await this.userBalanceHandler.walletBalanceInUsd(
			unit,
			WalletType.VAULT,
		);

		expect(backendUsd).toBeCloseTo(expectedUsd, 2);
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
