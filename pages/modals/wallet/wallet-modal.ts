import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { WalletModalAsserter } from "./wallet-modal-asserter";
import { WalletModalMap } from "./wallet-modal-map";
import { WalletModalSteps } from "./wallet-modal-steps";
import { sanitizeAmount } from "@support/regex-patterns";

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

	public async openWithdrawTab(): Promise<void> {
		await this.map.withdrawTabButton.click();
	}

	public async openVaultTab(): Promise<void> {
		await this.map.vaultTabButton.click();
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
}
