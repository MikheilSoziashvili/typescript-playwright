import { BasePageStep } from "@pages/base/base-page-step";
import { WalletModal } from "./wallet-modal";
import { step } from "decorators/step";
import { parseToFloat } from "@core/utils/utils";

export class WalletModalSteps extends BasePageStep<WalletModal> {
	public constructor(page: WalletModal) {
		super(page);
	}

	private formatAmount(amount: number): string {
		const roundedAmount = parseToFloat(amount);
		return `$${Number(roundedAmount).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	}

	private async getVaultAmountMinusOne(): Promise<number> {
		const rawAmountText = await this.gamdomPage.getVaultWalletAmount();
		return parseFloat(rawAmountText) - 1;
	}

	@step(
		`Check if user is redirected to the vault from the wallet withdraw tab`,
	)
	public async vaultRedirectedFromWithdrawTab(): Promise<void> {
		await this.gamdomPage.openWithdrawTab();
		await this.gamdomPage.map.vaultButtonInWithdrawTab.click();
		await this.gamdomPage.assertThat().vaultTabHeadingIsDisplayed();
	}

	@step(
		`Deposit from a given wallet and verify the amount is available in the vault`,
	)
	public async depositFromWalletAndVerify(
		wallet: string,
		depositAmount?: number,
	): Promise<void> {
		await this.gamdomPage.openVaultTab();
		await this.gamdomPage.selectWalletOption(wallet);

		const amount =
			depositAmount !== undefined
				? depositAmount
				: await this.getVaultAmountMinusOne();

		await this.gamdomPage.fillVaultAmount(amount);
		await this.gamdomPage.clickDepositButton();

		const formattedAmount = this.formatAmount(amount);

		await this.gamdomPage
			.assertThat()
			.vaultDepositToastMessageIsDisplayed(formattedAmount);
		await this.gamdomPage.openWithdrawTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);
		await this.gamdomPage.assertThat().vaultWalletAmountIs(amount);
	}

	@step(
		`Withdraw from a given vault wallet and verify the amount is available in the wallet`,
	)
	public async withdrawFromVaultAndVerify(wallet: string): Promise<void> {
		await this.depositFromWalletAndVerify(wallet);
		await this.gamdomPage.openWithdrawTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);

		const amount = await this.getVaultAmountMinusOne();

		await this.gamdomPage.fillVaultAmount(amount);
		await this.gamdomPage.clickWithdrawButton();

		const formattedWithdraw = this.formatAmount(amount);

		await this.gamdomPage
			.assertThat()
			.vaultWithdrawToastMessageIsDisplayed(formattedWithdraw);
		await this.gamdomPage.openDepositTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);
		await this.gamdomPage.assertThat().vaultWalletAmountIs(amount + 1);
	}

	public async withdrawInVaultWith2FaFlow(
		walletOption: string,
		amount: number,
		qrCode2FAImagePath: string,
	): Promise<void> {
		await this.gamdomPage.withdrawInVault(walletOption, amount);
		await this.gamdomPage.twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
	}
}
