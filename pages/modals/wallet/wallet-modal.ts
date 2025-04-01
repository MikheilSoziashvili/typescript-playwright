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

	public async openWithdrawTab(): Promise<void> {
		await this.map.withdrawTabButton.click();
	}

	public async openVaultTab(): Promise<void> {
		await this.map.vaultTabButton.click({ timeout: Timeout.LONG });
	}

	public async openWithdrawTabInVault(): Promise<void> {
		await this.map.vaultWithdrawTab.click();
	}

	public async openDepositTabInVault(): Promise<void> {
		await this.map.vaultDepositTab.click();
	}

	public async selectWalletOption(option: string): Promise<void> {
		await this.map.walletDropdown.click();
		await this.map.walletDropdownOption(option).click();
	}

	public async fillVaultAmount(amount: number): Promise<void> {
		await this.map.vaultInputField.fill(`${amount}`);
	}

	public async clickDepositButton(): Promise<void> {
		await this.map.depositButton.click();
	}

	public async clickWithdrawButton(): Promise<void> {
		await this.map.withdrawButton.click();
	}

	public async getVaultWalletAmount(): Promise<string> {
		const amountLocator = this.map.vaultWalletAmount;
		const amountText = (await amountLocator.textContent()) ?? "";
		return amountText.replace(sanitizeAmount, "");
	}

	public async withdrawInVault(
		walletOption: string,
		amount: number,
	): Promise<void> {
		await this.openWithdrawTabInVault();
		await this.selectWalletOption(walletOption);
		await this.fillVaultAmount(amount);
		await this.clickWithdrawButton();
	}

	@step()
	public async selectPaymentMethod(paymentMethod: string): Promise<void> {
		await this.map.cryptoPaymentMethod(paymentMethod).click();
	}

	@step()
	public async getDepositAddress(): Promise<string> {
		return this.map.cryptoDepositAddress.inputValue();
	}

	@step()
	public async fillBitcoinAddress(address: string): Promise<void> {
		await this.map.bitcoinAddressInput.fill(address);
	}

	@step()
	public async fillBitcoinWithdrawAmount(amount: number): Promise<void> {
		await this.map.bitcoinWithdrawInput.fill(`${amount}`);
	}

	//TODO: Revise below method into a more generic one when new crypto withdraw tests are developed, since currently the behaviour is unknown.
	@step()
	public async withdrawBtc(address: string, amount: number): Promise<void> {
		await this.openWithdrawTab();
		await this.selectPaymentMethod(Cryptocurrency.Bitcoin);
		await this.fillBitcoinAddress(address);
		await this.fillBitcoinWithdrawAmount(amount);
		await this.clickWithdrawButton();
	}
}
