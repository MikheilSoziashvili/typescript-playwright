import { BasePageStep } from "@pages/base/base-page-step";
import { WalletModal } from "./wallet-modal";
import { step } from "decorators/step";
import { Toast } from "@pages/components/toast/toast";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryAvailableBankPaymentMethods } from "test-data/interfaces/domain/user-wallet-domain-interfaces";

export class WalletModalSteps extends BasePageStep<WalletModal> {
	public constructor(page: WalletModal) {
		super(page);
	}

	private formatAmount(amount: number): string {
		const rounded = Number(amount.toFixed(2));
		return `$${rounded.toLocaleString("en-US", {
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
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);

		const formattedAmount = this.formatAmount(expectedAmountUsd);

		await this.gamdomPage
			.assertThat()
			.vaultDepositToastMessageIsDisplayed(formattedAmount);
		await this.gamdomPage.openWithdrawTabInVault();
		await this.gamdomPage.selectWalletOption(wallet);
		await this.gamdomPage
			.assertThat()
			.vaultWalletAmountIs(expectedAmountUsd, unit);
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
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
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

		const remainingUsd =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);
		await this.gamdomPage
			.assertThat()
			.vaultWalletAmountIs(remainingUsd, unit);
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

	@step(
		"Verify withdraw 'Email Not Verified' in left panel for each cryptocurrency",
	)
	public async verifyWithdrawCryptoEmailNotVerifiedMessage(): Promise<void> {
		for (const crypto of Object.values(Cryptocurrency)) {
			// Not each cryptocurrency is always available
			const isClicked = await this.gamdomPage.selectPaymentMethod(
				crypto,
				{ skipIfMissing: true },
			);
			if (isClicked) {
				await this.gamdomPage
					.assertThat()
					.withdrawCryptoLeftPanelHeaderCorrect(crypto);
				await this.gamdomPage
					.assertThat()
					.withdrawEmailNotVerifiedPanelContentCorrect();
			}
		}
	}

	@step("Verify bank withdraw payment method for country is present")
	public async verifyWithdrawBankPaymentMethodPresentForCountry(
		country: CountryCodeISO3166,
	): Promise<void> {
		await this.gamdomPage.selectWithdrawCountry(country);
		await this.gamdomPage
			.assertThat()
			.withdrawBankPaymentMethodPresentForCountry(country);
	}

	@step(
		"Verify withdraw 'Email Not Verified' in left panel for bank - Havale1 and UPI",
	)
	public async verifyWithdrawBankEmailNotVerifiedMessage(
		countryAvailableBankPaymentMethods: CountryAvailableBankPaymentMethods,
	): Promise<void> {
		for (const [country, bankPaymentMethods] of Object.entries(
			countryAvailableBankPaymentMethods,
		) as [CountryCodeISO3166, BankPaymentMethod[]][]) {
			await this.verifyWithdrawBankPaymentMethodPresentForCountry(
				country,
			);

			for (const bankPaymentMethod of bankPaymentMethods) {
				await this.gamdomPage.selectBankWithdrawPaymentMethod(
					bankPaymentMethod,
				);
				await this.gamdomPage
					.assertThat()
					.withdrawBankLeftPanelHeaderCorrect(bankPaymentMethod);
				await this.gamdomPage
					.assertThat()
					.withdrawEmailNotVerifiedPanelContentCorrect();
			}
		}
	}

	@step("Resend verification email on Withdraw tab successfully")
	public async resendVerificationWithdrawEmailSuccessfully(): Promise<void> {
		await this.gamdomPage.resendVerificationWithdrawEmailNotConfirmed();
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.RESEND_VERIFICATION_EMAIL_SUCCESSFULLY,
			);
	}

	@step(
		`Deposit from a given wallet and verify the amount is available in the vault - v4`,
	)
	public async depositFromWalletAndVerifyV4(
		wallet: string,
		unit: Unit,
		depositAmount?: number,
	): Promise<void> {
		await this.gamdomPage.openVaultTabV4();
		await this.gamdomPage.selectWalletOptionV4(wallet);

		const amount =
			depositAmount !== undefined
				? depositAmount
				: await this.getVaultAmountMinusOneV4();

		await this.gamdomPage.fillVaultAmountV4(amount);
		await this.gamdomPage.clickVaultSubmitButtonV4();

		const expectedAmountUsd =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);

		const formattedAmount = this.formatAmount(expectedAmountUsd);

		await this.gamdomPage
			.assertThat()
			.vaultDepositToastMessageIsDisplayedV4(formattedAmount);
		await this.gamdomPage.openWithdrawTabInVaultV4();
		await this.gamdomPage.selectWalletOptionV4(wallet);
		await this.gamdomPage
			.assertThat()
			.vaultWalletAmountIs(expectedAmountUsd, unit);
	}

	@step(
		`Withdraw from a given vault wallet and verify the amount is available in the wallet - v4`,
	)
	public async withdrawFromVaultAndVerifyV4(
		wallet: string,
		unit: Unit,
	): Promise<void> {
		await this.depositFromWalletAndVerifyV4(wallet, unit);
		await this.gamdomPage.openWithdrawTabInVaultV4();
		await this.gamdomPage.selectWalletOptionV4(wallet);

		const amount = await this.getVaultAmountMinusOneV4();
		const usdBeforeWithdrawal =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);
		const formattedToast = this.formatAmount(usdBeforeWithdrawal - 1);

		await this.gamdomPage.fillVaultAmountV4(amount);
		await this.gamdomPage.clickVaultSubmitButtonV4();

		await this.gamdomPage
			.assertThat()
			.vaultWithdrawToastMessageIsDisplayedV4(formattedToast);
		await this.gamdomPage.openDepositTabInVaultV4();
		await this.gamdomPage.selectWalletOptionV4(wallet);

		const remainingUsd =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);
		await this.gamdomPage
			.assertThat()
			.vaultWalletAmountIs(remainingUsd, unit);
	}

	@step("Get vault amount minus one - v4")
	private async getVaultAmountMinusOneV4(): Promise<number> {
		const rawAmountText = await this.gamdomPage.getVaultWalletAmountV4();
		return parseFloat(rawAmountText) - 1;
	}

	@step("Open withdraw tab and verify crypto currency method presence")
	public async openWithdrawTabAndVerifyCryptoCurrencyPresence(
		cryptoCurrency: Cryptocurrency | CryptoTicker,
		expectedPresence: boolean,
	): Promise<void> {
		await this.gamdomPage.openWithdrawTab();
		await this.gamdomPage
			.assertThat()
			.cryptoPaymentMethodIsPresent(cryptoCurrency, expectedPresence);
	}

	@step("Open deposit tab and verify crypto currency method presence")
	public async openDepositTabAndVerifyCryptoCurrencyPresence(
		cryptoCurrency: Cryptocurrency | CryptoTicker,
		expectedPresence: boolean,
	): Promise<void> {
		await this.gamdomPage.openDepositTab();
		await this.gamdomPage
			.assertThat()
			.cryptoPaymentMethodIsPresent(cryptoCurrency, expectedPresence);
	}
}
