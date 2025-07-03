import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { WalletModalAsserter } from "./wallet-modal-asserter";
import { WalletModalMap } from "./wallet-modal-map";
import { WalletModalSteps } from "./wallet-modal-steps";
import { sanitizeAmount } from "@support/regex-patterns";
import { Timeout } from "@enums/timeout";
import { TwoFactorAuthModal } from "../two-factor-authentication-modal/two-factor-auth-modal";
import { step } from "decorators/step";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { expect } from "@playwright/test";

export class WalletModal extends BasePage<WalletModalMap> {
	public constructor(page: Page) {
		super(page, new WalletModalMap(page));
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

	@step("Open vault tab")
	public async openVaultTab(): Promise<void> {
		await this.map.vaultTabButton.click({ timeout: Timeout.LONG });
	}

	@step("Open redeem tab")
	public async openRedeemTab(): Promise<void> {
		await this.map.redeemTabButton.click({ timeout: Timeout.LONG });
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

	@step("Fill vault amount")
	public async fillVaultAmount(amount: number): Promise<void> {
		await this.map.vaultInputField.fill(`${amount}`);
	}

	@step("Fill promo code")
	public async fillPromoCode(promoCode: string): Promise<void> {
		await this.map.promoCodeInputField.clear();
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

	@step("Get vault wallet amount")
	public async getVaultWalletAmount(): Promise<string> {
		const amountLocator = this.map.vaultWalletAmount;
		const amountText = (await amountLocator.textContent()) ?? "";
		return amountText.replace(sanitizeAmount, "");
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
	public async selectPaymentMethod(paymentMethod: string): Promise<void> {
		await this.map.cryptoPaymentMethod(paymentMethod).click();
	}

	@step("Get deposit address")
	public async getDepositAddress(): Promise<string> {
		await expect
			.poll(() => this.map.cryptoDepositAddress.inputValue())
			.not.toContain("retrieving");

		return this.map.cryptoDepositAddress.inputValue();
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
}
