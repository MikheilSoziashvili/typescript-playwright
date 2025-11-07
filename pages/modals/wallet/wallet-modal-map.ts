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

	public get walletHeaderTabsContainer(): Locator {
		return this.page
			.getByTestId("walletModalHeaderContainer")
			.getByTestId("walletModalTabsContainer");
	}

	public get withdrawTabButton(): Locator {
		return this.walletHeaderTabsContainer.getByTestId("withdrawButton");
	}

	public get vaultTabButton(): Locator {
		return this.walletHeaderTabsContainer.getByTestId("vaultButton");
	}

	public get redeemTabButton(): Locator {
		return this.page.getByTestId("redeemButton");
	}

	public get buyCryptoTabButton(): Locator {
		return this.page.getByTestId("buyCryptoButton");
	}

	public get vaultButtonInWithdrawTab(): Locator {
		return this.page.getByTestId("vaultPaymentMethodContainer");
	}

	public get vaultTabHeading(): Locator {
		return this.vaultLeftPanel.getByTestId("headerContainer");
	}

	public get vaultLeftPanel(): Locator {
		return this.page.getByTestId("vaultLeftPanelContainer");
	}

	public get walletLeftPanel(): Locator {
		return this.page.getByTestId("LeftPanelContainer");
	}

	public get leftPanelVaultActionButtonsContainer(): Locator {
		return this.vaultLeftPanel.getByTestId("walletVaultActionsContainer");
	}

	public get vaultWithdrawTab(): Locator {
		return this.leftPanelVaultActionButtonsContainer.getByTestId(
			"vaultWithdrawButton",
		);
	}

	public get vaultDepositTab(): Locator {
		return this.leftPanelVaultActionButtonsContainer.getByTestId(
			"vaultDepositButton",
		);
	}

	public get walletDepositWithdrawContainer(): Locator {
		return this.vaultLeftPanel.getByTestId(
			"vaultWithdrawDespositActionsContainer",
		);
	}

	public get walletDropdown(): Locator {
		return this.walletDepositWithdrawContainer.locator(
			"[data-testid*='WalletDropdownOption']",
		);
	}

	public walletDropdownOption(optionText: string): Locator {
		return this.page
			.getByRole("listbox")
			.locator(`h6[data-testid="walletDropdownSelectedValueContainer"]`, {
				hasText: optionText,
			});
	}

	public get vaultWalletAmount(): Locator {
		return this.vaultLeftPanel.locator("h6 > span");
	}

	public get vaultInputField(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId("Input");
	}

	public get depositButton(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"depositToVaultButton",
		);
	}

	public get withdrawButton(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"withdrawFromVaultButton",
		);
	}

	public get promoCodeInputField(): Locator {
		return this.walletLeftPanel.locator('input[placeholder="Enter Code"]');
	}

	public get redeemPromoCodeButton(): Locator {
		return this.walletLeftPanel.locator("button", { hasText: "Redeem" });
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

	public get depositDisabledText(): Locator {
		return this.walletLeftPanel.locator("h5", {
			hasText: "Deposits Disabled",
		});
	}

	public get cryptoDestinationTag(): Locator {
		return this.page.getByLabel("Your personal Destination Tag");
	}
}
