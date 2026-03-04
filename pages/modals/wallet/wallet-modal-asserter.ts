import { WalletModalContent } from "@constants/wallet-modal-content";
import { bankPaymentMethodLabelMap } from "@core/mappings/bank/bank-payment-method-label-map";
import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { TransactionType } from "@enums/transaction-types";
import { Currency } from "@enums/currencies";
import { Timeout } from "@enums/timeout";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { expect } from "playwright/test";
import { WalletModal } from "./wallet-modal";

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

	@step("Vault wallet amount is")
	public async vaultWalletAmountIs(
		expectedUsd: number,
		unit: Unit,
	): Promise<void> {
		if (unit === Unit.COINS) {
			const backendUsd =
				await this.userBalanceHandler.walletBalanceInFiatRounded(
					unit,
					Currency.USD,
					WalletType.VAULT,
				);
			expect(backendUsd).toBeCloseTo(expectedUsd, 1);
			return;
		}

		const {
			balance: actualBalance,
			cryptoPrice,
			divisor,
		} = await this.userBalanceHandler.getWalletBalanceSnapshot(
			unit,
			WalletType.VAULT,
		);

		const expectedBalance = (expectedUsd / cryptoPrice) * divisor;
		const tolerance = Math.max(expectedBalance * 0.001, 1);

		expect(actualBalance).toBeGreaterThanOrEqual(
			Math.floor(expectedBalance - tolerance),
		);
		expect(actualBalance).toBeLessThanOrEqual(
			Math.ceil(expectedBalance + tolerance),
		);
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

	@step("Verify deposit Disabled text is displayed")
	public async verifyDepositDisabledTextIsDisplayed(): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.depositDisabledText,
				expectedText: "Deposits Disabled",
			},
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

	@step("Crypto payment method is present")
	public async cryptoPaymentMethodIsPresent(
		cryptoCurrency: Cryptocurrency | CryptoTicker,
		expectedPresence: boolean,
		type: TransactionType,
	): Promise<void> {
		const paymentMethodLocator =
			this.gamdomPage.map.cryptoPaymentMethod(type, cryptoCurrency);

		if (expectedPresence) {
			await this.checkElementsAreVisible(
				[paymentMethodLocator],
				Timeout.SHORT,
			);
		} else {
			await this.checkElementsAreNotVisible(
				[paymentMethodLocator],
				Timeout.SHORT,
			);
		}
	}

	@step("Network fee matches expected value")
	public async networkFeeMatchesExpected(
		expectedFeeInUsd: number,
		actualFeeInUsd: number,
	): Promise<void> {
		expect(actualFeeInUsd).toBe(expectedFeeInUsd);
	}

	@step("Verify deposit tab is not visible for banned user")
	public async depositTabIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.depositTabButton,
		]);
	}

	@step("Verify withdraw and vault tabs are visible")
	public async withdrawAndVaultTabsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.withdrawTabButton,
			this.gamdomPage.map.vaultTabButton,
		]);
	}

		@step("Verify only Withdraw and Vault tabs are visible")
	public async onlyWithdrawAndVaultTabsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.withdrawTabButton,
			this.gamdomPage.map.vaultTabButton,
		]);
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.depositTabButton,
		]);
	}
}
