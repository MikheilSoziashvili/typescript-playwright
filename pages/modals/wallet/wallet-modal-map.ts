import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class WalletModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get vaultDepositToastMessage(): Locator {
		return this.page
			.getByTestId("toastSubTitle")
			.getByText("transferred from your Wallet to your Vault");
	}

	public get vaultWithdrawToastMessage(): Locator {
		return this.page
			.getByTestId("toastSubTitle")
			.getByText("transferred from your Vault to your Wallet");
	}

	public get withdrawTabButton(): Locator {
		return this.page.locator("button", { hasText: "Withdraw" });
	}

	public get vaultTabButton(): Locator {
		return this.page.locator("button", { hasText: "Vault" });
	}

	public get vaultButtonInWithdrawTab(): Locator {
		return this.page.locator("p", { hasText: "Vault" });
	}

	public get vaultTabHeading(): Locator {
		return this.leftPanel.locator("h5", { hasText: "Vault" });
	}

	public get leftPanel(): Locator {
		return this.page.locator('div[class*="LeftPanel"]');
	}

	public get vaultWithdrawTab(): Locator {
		return this.leftPanel.locator("button", { hasText: /^Withdraw$/ });
	}

	public get vaultDepositTab(): Locator {
		return this.leftPanel.locator("button", { hasText: "Deposit" });
	}

	public get walletDropdown(): Locator {
		return this.page.locator(
			"//h6[contains(@class,'Vault-styled')]/ancestor::div[@role='combobox']",
		);
	}

	public walletDropdownOption(optionText: string): Locator {
		return this.page.locator(`li[class*="Vault-styled__MenuOptions"] h6`, {
			hasText: optionText,
		});
	}

	public get vaultWalletAmount(): Locator {
		return this.leftPanel.locator("h6 > span");
	}

	public get vaultInputField(): Locator {
		return this.leftPanel.locator(
			'input[class*="MuiInputBase-input MuiInput-input"]',
		);
	}

	public get vaultDepositButton(): Locator {
		return this.page.getByTestId("depositToVaultButton");
	}

	public get vaultWithdrawButton(): Locator {
		return this.page.getByTestId("withdrawFromVaultButton");
	}

	public get cryptoWithdrawButton(): Locator {
		return this.page.getByTestId("LeftPanelMainButton");
	}

	public cryptoPaymentMethod(paymentMethod: string): Locator {
		return this.page.getByTestId(`deposit-crypto-${paymentMethod}`);
	}

	public get cryptoDepositAddress(): Locator {
		return this.page.locator(
			'div[class*="CryptoDepositBody"][class*="Inputs"] input',
		);
	}

	public get bitcoinAddressInput(): Locator {
		return this.page.locator('input[placeholder="Your Bitcoin Address"]');
	}

	public get bitcoinWithdrawInput(): Locator {
		return this.page
			.locator('label:has-text("BTC to withdraw")')
			.locator("~ div input");
	}
}
