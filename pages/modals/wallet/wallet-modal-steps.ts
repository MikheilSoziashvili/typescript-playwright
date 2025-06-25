import { BasePageStep } from "@pages/base/base-page-step";
import { WalletModal } from "./wallet-modal";
import { step } from "decorators/step";
import { parseToFloat } from "@core/utils/utils";
import { Toast } from "@pages/components/toast/toast";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

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

	@step("Get vault amount minus one")
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
		unit: Unit,
		depositAmount?: number,
	): Promise<void> {
		await this.gamdomPage.openVaultTab();
		await this.gamdomPage.selectWalletOption(wallet);

		const amount =
			depositAmount !== undefined
				? depositAmount
				: await this.getVaultAmountMinusOne();

		await this.gamdomPage.fillVaultAmount(amount);
		await this.gamdomPage.clickVaultDepositButton();

		const expectedAmountUsd =
			await this.userBalanceHandler.walletBalanceInUsd(
				unit,
				WalletType.VAULT,
			);

		const formattedAmount = this.formatAmount(expectedAmountUsd);

		await this.gamdomPage
			.assertThat()
			.vaultDepositToastMessageIsDisplayed(formattedAmount);
		await this.gamdomPage.openWithdrawTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);
		await this.gamdomPage.assertThat().vaultWalletAmountIs(amount, unit);
	}

	@step(
		`Withdraw from a given vault wallet and verify the amount is available in the wallet`,
	)
	public async withdrawFromVaultAndVerify(
		wallet: string,
		unit: Unit,
	): Promise<void> {
		await this.depositFromWalletAndVerify(wallet, unit);
		await this.gamdomPage.openWithdrawTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);

		const amount = await this.getVaultAmountMinusOne();
		const usdBeforeWithdrawal =
			await this.userBalanceHandler.walletBalanceInUsd(
				unit,
				WalletType.VAULT,
			);
		const formattedToast = this.formatAmount(usdBeforeWithdrawal - 1);

		await this.gamdomPage.fillVaultAmount(amount);
		await this.gamdomPage.clickVaultWithdrawButton();

		await this.gamdomPage
			.assertThat()
			.vaultWithdrawToastMessageIsDisplayed(formattedToast);
		await this.gamdomPage.openDepositTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);
		await this.gamdomPage.assertThat().vaultWalletAmountIs(1, unit);
	}

	@step("Withdraw in vault with 2FA flow")
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

	@step(`Redeem a promo code`)
	public async redeemPromoCode(promoCode: string): Promise<void> {
		await this.gamdomPage.openRedeemTab();
		await this.gamdomPage.fillPromoCode(promoCode);
		await this.gamdomPage.clickRedeemPromoCodeButton();
	}

	@step(`Redeem a promo code and verify the success message is displayed`)
	public async redeemPromoCodeSuccessfully(promoCode: string): Promise<void> {
		await this.redeemPromoCode(promoCode);
		const toast = new Toast(this.gamdomPage.page);
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast.assertThat().subTitleIs(ToastSubTitle.PROMO_CODE_REDEEMED);
	}
}
