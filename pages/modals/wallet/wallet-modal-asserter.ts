import { BaseAsserter } from "@pages/base/base-asserter";
import { WalletModal } from "./wallet-modal";
import { Timeout } from "@enums/timeout";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { cryptocurrencyTickerMap } from "@core/mappings/crypto/cryptocurrency-ticker-map";
import { WalletModalContent } from "@constants/wallet-modal-content";
import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import { bankPaymentMethodLabelMap } from "@core/mappings/bank/bank-payment-method-label-map";

export class WalletModalAsserter extends BaseAsserter<WalletModal> {
	public constructor(page: WalletModal) {
		super(page);
	}

	@step("Vault tab heading is displayed")
	async vaultTabHeadingIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.vaultTabHeading],
			Timeout.SHORT,
		);
	}

	//Same in v3 and v4
	@step("Vault wallet amount is")
	public async vaultWalletAmountIs(
		expectedUsd: number,
		unit: Unit,
	): Promise<void> {
		const backendUsd =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);

		expect(backendUsd).toBeCloseTo(expectedUsd, 1);
	}

	@step("Vault deposit toast message is displayed")
	public async vaultDepositToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultDepositToastMessage,
		).toContainText(
			`${amount} has been transferred from your Wallet to your Vault`,
		);
	}

	@step("Crypto withdraw left panel header is correct")
	public async withdrawCryptoLeftPanelHeaderCorrect(
		cryptoCurrency: Cryptocurrency,
	): Promise<void> {
		const cryptoTicker =
			cryptoCurrency === Cryptocurrency.Tether
				? Cryptocurrency.Tether
				: cryptocurrencyTickerMap[cryptoCurrency];
		await expect(
			this.gamdomPage.map.walletLeftPanelCryptoWithdrawHeaderTitle,
		).toHaveText(`${cryptoTicker} Withdraw`);
	}

	@step("Bank withdraw left panel header is correct")
	public async withdrawBankLeftPanelHeaderCorrect(
		bankPaymentMethod: BankPaymentMethod,
	): Promise<void> {
		const bankPaymentMethodName =
			bankPaymentMethod === BankPaymentMethod.HAVALE1
				? ""
				: `${bankPaymentMethodLabelMap[bankPaymentMethod]} `;

		await this.checkElementsHaveText([
			{
				locator:
					this.gamdomPage.map.walletLeftPanelBankWithdrawHeaderTitle,
				expectedText: `${bankPaymentMethodName}Withdraw`,
			},
		]);
	}

	@step("Withdraw error 'Email Not Verified' in left panel is correct")
	public async withdrawEmailNotVerifiedPanelContentCorrect(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.withdrawEmailNotConfirmedIcon,
			this.gamdomPage.map.withdrawEmailNotConfirmedResendEmailButton,
		]);

		await this.checkElementsHaveText([
			{
				locator:
					this.gamdomPage.map
						.withdrawEmailNotConfirmedTextSectionHeader,
				expectedText: WalletModalContent.EMAIL_NOT_VERIFIED_TITLE,
			},
			{
				locator:
					this.gamdomPage.map
						.withdrawEmailNotConfirmedTextSectionContent,
				expectedText: WalletModalContent.EMAIL_NOT_VERIFIED_BODY,
			},
		]);
	}

	@step("Bank withdraw payment methods are visible for country")
	public async withdrawBankPaymentMethodPresentForCountry(
		country?: CountryCodeISO3166,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bankPaymentMethod(BankPaymentMethod.HAVALE1),
		]);

		if (country === CountryCodeISO3166.INDIA) {
			await this.checkElementsAreVisible([
				this.gamdomPage.map.bankPaymentMethod(
					BankPaymentMethod.HAVALE1,
				),
				this.gamdomPage.map.bankPaymentMethod(BankPaymentMethod.UPI),
			]);
		}
	}

	@step("Vault withdraw toast message is displayed")
	public async vaultWithdrawToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultWithdrawToastMessage,
		).toContainText(
			`${amount} has been transferred from your Vault to your Wallet`,
		);
	}

	@step("Verify deposit Disabled text is displayed")
	public async verifyDepositDisabledTextIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.depositDisabledText,
		]);
	}

	@step("Verify KYC Level One container is visible")
	public async kycLevelOneContainerIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelOneCotainer,
		]);
	}

	@step("Verify deposit address input field is visible")
	public async depositAddressInputFieldIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bitcoinAddressInput,
		]);
	}

	@step("Verify that Veriff iFrame is visible")
	public async verifyThatVeriffIFrameIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.veriffIFrameElement,
		]);
	}

	@step("KYC Level Two Verification title is visible")
	public async kycLevelTwoVerificationTitleIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelTwoHeader,
		]);
	}

	@step("KYC Level Three Verification header is visible")
	public async kycLevelThreeVerificationHeaderIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelThreeHeader,
		]);
	}

	@step("Vault deposit toast message is displayed - v4")
	public async vaultDepositToastMessageIsDisplayedV4(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultDepositToastMessageV4,
		).toContainText(
			`${amount} has been transferred from your Wallet to your Vault`,
		);
	}

	@step("Vault withdraw toast message is displayed - v4")
	public async vaultWithdrawToastMessageIsDisplayedV4(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultWithdrawToastMessageV4,
		).toContainText(
			`${amount} has been transferred from your Vault to your Wallet`,
		);
	}
}
