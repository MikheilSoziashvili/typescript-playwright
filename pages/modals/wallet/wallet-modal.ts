import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { WalletModalAsserter } from "./wallet-modal-asserter";
import { WalletModalMap } from "./wallet-modal-map";
import { WalletModalSteps } from "./wallet-modal-steps";
import { sanitizeAmount } from "@support/regex-patterns";
import { Timeout } from "@enums/timeout";
import { TwoFactorAuthModal } from "../two-factor-authentication-modal/two-factor-auth-modal";
import { step } from "decorators/step";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { expect } from "@playwright/test";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import { Toast } from "@pages/components/toast/toast";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";
import { logger } from "@logger/logger";

export class WalletModal extends BasePage<WalletModalMap> {
	public toast: Toast;

	public constructor(page: Page) {
		super(page, new WalletModalMap(page));
		this.toast = new Toast(page);
	}

	public override assertThat(): WalletModalAsserter {
		return new WalletModalAsserter(this);
	}

	public steps(): WalletModalSteps {
		return new WalletModalSteps(this);
	}

	public get twoFactorAuthModal(): TwoFactorAuthModal {
		return new TwoFactorAuthModal(this.page);
	}

	@step("Open withdraw tab")
	public async openWithdrawTab(): Promise<void> {
		await this.map.withdrawTabButton.click();
	}

	@step("Open deposit tab")
	public async openDepositTab(): Promise<void> {
		await this.map.depositTabButton.click();
	}

	@step("Open redeem tab")
	public async openRedeemTab(): Promise<void> {
		await this.map.redeemTabButton.click();
	}

	@step("Open Buy crypto tab")
	public async openBuyCryptoTab(): Promise<void> {
		await this.map.buyCryptoTabButton.click();
	}

	@step("Fill promo code")
	public async fillPromoCode(promoCode: string): Promise<void> {
		await this.map.promoCodeInputField.fill(`${promoCode}`);
	}

	@step("Click redeem promo code button")
	public async clickRedeemPromoCodeButton(): Promise<void> {
		await this.map.redeemPromoCodeButton.click();
	}

	@step("Click vault deposit button")
	public async clickVaultDepositButton(): Promise<void> {
		await this.map.vaultDepositButton.click();
	}

	@step("Click vault withdraw button")
	public async clickVaultWithdrawButton(): Promise<void> {
		await this.map.vaultWithdrawButton.click();
	}

	@step("Click crypto withdraw button")
	public async clickCryptoWithdrawButton(): Promise<void> {
		await this.map.cryptoWithdrawButton.click();
	}

	@step("Withdraw in vault")
	public async withdrawInVault(
		walletOption: string,
		amount: number,
	): Promise<void> {
		await this.openWithdrawTabInVault();
		await this.selectWalletOption(walletOption);
		await this.fillVaultAmount(amount);
		await this.clickVaultWithdrawButton();
	}

	@step("Select payment method")
	public async selectPaymentMethod(
		paymentMethod: string,
		options?: { skipIfMissing?: boolean },
	): Promise<boolean> {
		const cryptoPayMethod =
			this.map.withdrawCryptoPaymentMethod(paymentMethod);

		if (options?.skipIfMissing) {
			return this.clickIfPresent(cryptoPayMethod, {
				timeout: Timeout.EXTRA_SHORT,
			});
		}

		await cryptoPayMethod.click();
		return true;
	}

	@step("Select bank withdraw payment method")
	public async selectBankWithdrawPaymentMethod(
		paymentMethod: string,
	): Promise<void> {
		await this.map.bankPaymentMethod(paymentMethod).click();
	}

	@step("Get deposit address")
	public async getDepositAddress(): Promise<string> {
		await expect
			.poll(() => this.map.cryptoDepositAddress.first().inputValue(), {
				timeout: Timeout.MEDIUM,
				message:
					"Deposit address never resolved — stuck in retrieving or not found state",
			})
			.not.toMatch(/retrieving|deposit address not found/i);

		return this.map.cryptoDepositAddress.first().inputValue();
	}

	@step("Fill bitcoin address")
	public async fillBitcoinAddress(address: string): Promise<void> {
		await this.map.bitcoinAddressInput.fill(address);
	}

	@step("Fill bitcoin withdraw amount")
	public async fillBitcoinWithdrawAmount(amount: number): Promise<void> {
		await this.map.bitcoinWithdrawInput.fill(`${amount}`);
	}

	//TODO: Revise below method into a more generic one when new crypto withdraw tests are developed, since currently the behaviour is unknown.
	@step("Withdraw btc")
	public async withdrawBtc(address: string, amount: number): Promise<void> {
		await this.openWithdrawTab();
		await this.selectPaymentMethod(Cryptocurrency.Bitcoin);
		await this.fillBitcoinAddress(address);
		await this.fillBitcoinWithdrawAmount(amount);
		await this.clickCryptoWithdrawButton();
	}

	@step("Get destination tag")
	public async getDestinationTag(): Promise<string> {
		await expect
			.poll(() => this.map.cryptoDestinationTag.inputValue())
			.not.toContain("retrieving");

		return this.map.cryptoDestinationTag.inputValue();
	}

	@step(`Selects a given crypto deposit method and returns the details`)
	public async selectCryptoAndGetDepositDetails(
		cryptoCurrency: Cryptocurrency | CryptoTicker,
	): Promise<{
		cryptoCurrency: Cryptocurrency | CryptoTicker;
		address: string;
	}> {
		await this.selectPaymentMethod(cryptoCurrency);

		const address = await this.getDepositAddress();

		return { cryptoCurrency, address };
	}

	@step(`Selects XRP and returns deposit details with destination tag`)
	public async selectXrpAndGetDepositDetails(): Promise<{
		address: string;
		destinationTag: string | number;
	}> {
		await this.selectPaymentMethod(Cryptocurrency.Ripple);
		const address = await this.getDepositAddress();
		const destinationTag = await this.getDestinationTag();

		return { address, destinationTag };
	}

	@step("Open withdraw tab and select payment method")
	public async openWithdrawTabAndSelectPaymentMethod(
		paymentMethod: string,
	): Promise<void> {
		await this.openWithdrawTab();
		await this.selectPaymentMethod(paymentMethod);
	}

	@step("Resend verification email on Withdraw tab if email is not confirmed")
	public async resendVerificationWithdrawEmailNotConfirmed(): Promise<void> {
		await this.map.withdrawEmailNotConfirmedResendEmailButton.click();
		await this.map.withdrawEmailNotConfirmedResendEmailContinueButton.click();
	}

	@step("Select USDT Network from dropdown")
	public async selectDepositNetwork(network: string): Promise<void> {
		await this.map.networkDropdown.click();
		await this.map.networkDropdownOption(network).click();
	}

	@step("Select withdraw country")
	public async selectWithdrawCountry(
		country: CountryCodeISO3166,
	): Promise<void> {
		await this.map.withdrawCountryDropdownOption.click();
		await this.map.withdrawCountryDropdownOptions(country).click();
	}

	@step("Select withdrawal speed")
	public async selectWithdrawalSpeed(speed: WithdrawalSpeed): Promise<void> {
		await this.map.withdrawalSpeedButton(speed).click();
	}

	@step("Fill withdrawal amount")
	public async fillWithdrawalAmount(amount: number): Promise<void> {
		await this.map.usdWithdrawAmountInput().fill(amount.toString());
	}

	@step(
		"Withdraw a selected crypto with given parameters depending on the cryptocurrency",
	)
	public async withdrawCrypto(params: {
		cryptocurrency: Cryptocurrency | CryptoTicker;
		address: string;
		amount: number;
		speed: WithdrawalSpeed;
		network?: string;
		destinationTag?: string;
		isVip?: boolean;
		expectedCustomFee?: number;
	}): Promise<string> {
		const {
			cryptocurrency,
			address,
			amount,
			speed,
			network,
			destinationTag,
			isVip,
			expectedCustomFee,
		} = params;

		await this.openWithdrawTab();
		await this.selectPaymentMethod(cryptocurrency);
		await this.selectPaymentMethod(cryptocurrency);

		if (
			[
				Cryptocurrency.Tether,
				CryptoTicker.USDT,
				Cryptocurrency.USDC,
				CryptoTicker.USDC,
				Cryptocurrency.USD1,
				CryptoTicker.USD1,
			].includes(cryptocurrency) &&
			network
		) {
			await this.selectDepositNetwork(network);
		}

		await this.selectWithdrawalSpeed(speed);
		await this.map.withdrawAddressInput().fill(address);

		if (
			(cryptocurrency === Cryptocurrency.Ripple ||
				cryptocurrency === CryptoTicker.XRP) &&
			destinationTag
		) {
			await this.map.cryptoWithdrawDestinationTag.fill(destinationTag);
		}

		await this.fillWithdrawalAmount(amount);

		const networkFee = await this.getNetworkFeeAmount(isVip, speed);

		const isStandardSpeed = speed === WithdrawalSpeed.Standard;
		if (expectedCustomFee && !(isVip && isStandardSpeed)) {
			await this.assertThat().networkFeeMatchesExpected(
				expectedCustomFee,
				parseFloat(networkFee),
			);
		}

		await this.clickCryptoWithdrawButton();
		return networkFee;
	}

	@step("Get network fee amount")
	public async getNetworkFeeAmount(
		isVip: boolean | undefined,
		speed: WithdrawalSpeed,
	): Promise<string> {
		const isNetworkFeeVisible = await this.map.networkFeeAmount.isVisible();
		const isStandardSpeed = speed === WithdrawalSpeed.Standard;

		if (isVip && isStandardSpeed && !isNetworkFeeVisible) {
			await this.assertThat().checkElementsAreVisible([
				this.map.userIsVipText,
			]);
			logger.info("User is VIP - no network fee applied.");
			return "0";
		}

		const feeAmount = await this.map.networkFeeAmount.textContent();
		if (!feeAmount) {
			throw new Error("Network fee amount could not be retrieved.");
		}
		return feeAmount.trim();
	}

	@step("Open vault tab")
	public async openVaultTab(): Promise<void> {
		await this.map.vaultTabButton.click({ timeout: Timeout.LONG });
	}

	@step("Open withdraw tab in vault")
	public async openWithdrawTabInVault(): Promise<void> {
		await this.map.vaultWithdrawTab.click();
	}

	@step("Open deposit tab in vault")
	public async openDepositTabInVault(): Promise<void> {
		await this.map.vaultDepositTab.click();
	}

	@step("Select wallet option")
	public async selectWalletOption(option: string): Promise<void> {
		await this.map.walletDropdown.click();
		await this.map.walletDropdownOption(option).click();
	}

	@step("Get vault wallet amount")
	public async getVaultWalletAmount(): Promise<string> {
		const amountLocator = this.map.vaultWalletAmount;
		const amountText = (await amountLocator.textContent()) ?? "";
		return amountText.replace(sanitizeAmount, "");
	}

	@step("Fill vault amount")
	public async fillVaultAmount(amount: number): Promise<void> {
		await this.map.vaultInputField.fill(`${amount}`);
	}

	@step("Click vault deposit button")
	public async clickVaultSubmitButton(): Promise<void> {
		await this.map.vaultSubmitButton.click();
	}
}
