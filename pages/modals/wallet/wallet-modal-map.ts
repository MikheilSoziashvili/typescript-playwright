import { WalletModalContent } from "@constants/wallet-modal-content";
import { Button } from "@enums/buttons-texts";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";
import { BaseMap } from "@pages/base/base-map";
import { currencyAmountPattern } from "@support/regex-patterns";
import { Locator, Page } from "playwright";

export class WalletModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get walletLeftPanel(): Locator {
		return this.page.getByTestId("wallet-left-panel");
	}

	public get walletRightPanel(): Locator {
		return this.page.getByTestId("wallet-modal-main-grid");
	}

	public get walletMenu(): Locator {
		return this.walletLeftPanel.getByTestId("wallet-menu");
	}

	public get depositTabButton(): Locator {
		return this.walletMenu.getByTestId("wallet-menu-deposit");
	}

	public get withdrawTabButton(): Locator {
		return this.walletMenu.getByTestId("wallet-menu-withdraw");
	}

	public get buyCryptoTabButton(): Locator {
		return this.walletMenu.getByTestId("wallet-menu-buycrypto");
	}

	public get vaultTabButton(): Locator {
		return this.walletMenu.getByTestId("wallet-menu-vault");
	}

	public get redeemTabButton(): Locator {
		return this.walletMenu.getByTestId("wallet-menu-redeem");
	}

	public get vaultButtonInWithdrawTab(): Locator {
		return this.page.getByTestId(
			"withdraw-other-section-vaultPaymentMethodContainer",
		);
	}

	public get vaultTabHeading(): Locator {
		return this.vaultPanel.getByTestId("vault-wallet-title");
	}

	public get vaultPanel(): Locator {
		return this.page.getByTestId("vault");
	}

	public get depositTabContainer(): Locator {
		return this.page.getByTestId("deposit-sections-container");
	}

	public get withdrawTabContainer(): Locator {
		return this.page.getByTestId("withdraw-container-content");
	}

	public get cryptoWithdrawContainer(): Locator {
		return this.page.getByTestId("crypto-withdraw");
	}

	public get withdrawPanelCryptoHeaderTitle(): Locator {
		return this.cryptoWithdrawContainer.getByTestId(
			"crypto-withdraw-wallet-title",
		);
	}

	public get withdrawPanelCryptoCurrency(): Locator {
		return this.withdrawTabContainer.getByTestId(
			"wallet-sec-wallet-info-txt",
		);
	}

	//not present on withdraw panel - WIP
	public get withdrawPanelBankWithdrawHeader(): Locator {
		return this.withdrawTabContainer.locator(
			'[class*="WithDrawPanel-styled__Head-"]',
		);
	}

	//not present on withdraw panel - WIP
	public get walletLeftPanelBankWithdrawHeaderTitle(): Locator {
		return this.withdrawPanelBankWithdrawHeader.locator(
			'[class*="WithDrawPanel-styled__HeadWrapper"]',
		);
	}

	public get vaultPanelActionButtonsContainer(): Locator {
		return this.vaultPanel.getByTestId("vault-tabs-list");
	}

	public get depositButton(): Locator {
		return this.vaultPanel.getByTestId("vault-deposit-tab");
	}

	public get withdrawButton(): Locator {
		return this.vaultPanel.getByTestId("vault-withdraw-tab");
	}

	public get withdrawEmailNotConfirmedContainer(): Locator {
		return this.walletRightPanel.getByTestId(
			"email-not-verified-withdraw-main-container",
		);
	}

	public get withdrawEmailNotConfirmedIcon(): Locator {
		return this.withdrawEmailNotConfirmedContainer.locator("picture img");
	}

	public get withdrawEmailNotConfirmedTextSection(): Locator {
		return this.withdrawEmailNotConfirmedContainer.getByTestId(
			"email-not-verified-withdraw-content",
		);
	}

	public get withdrawEmailNotConfirmedTextSectionHeader(): Locator {
		return this.withdrawEmailNotConfirmedTextSection.getByTestId(
			"email-not-verified-withdraw-label",
		);
	}

	public get withdrawEmailNotConfirmedTextSectionContent(): Locator {
		return this.withdrawEmailNotConfirmedTextSection.getByTestId(
			"email-not-verified-withdraw-text",
		);
	}

	public get withdrawEmailNotConfirmedResendEmailButton(): Locator {
		return this.withdrawEmailNotConfirmedContainer.getByText(
			WalletModalContent.EMAIL_NOT_VERIFIED_BUTTON,
		);
	}

	public get withdrawEmailNotConfirmedResendEmailContinueButton(): Locator {
		return this.page
			.getByTestId("modalContainer")
			.getByTestId("confirmation-modal-continue-button");
	}

	public get withdrawCountryDropdownContainer(): Locator {
		return this.depositTabContainer.locator(
			'[class^="Withdraw-styled__CountriesSelectorWrapper"]',
		);
	}

	public get withdrawCountryDropdownOption(): Locator {
		return this.withdrawCountryDropdownContainer
			.getByTestId("Input")
			.filter({
				has: this.page.locator(`[role="combobox"]`),
			});
	}

	public withdrawCountryDropdownOptions(optionValue: string): Locator {
		return this.page
			.getByTestId("ListContainer")
			.locator(`li[data-value="${optionValue}"]`);
	}

	public get promoCodeInputField(): Locator {
		return this.walletLeftPanel.locator('input[placeholder="Enter Code"]');
	}

	public get redeemPromoCodeButton(): Locator {
		return this.walletLeftPanel.locator("button", { hasText: "Redeem" });
	}

	private vaultSubmitButtonByText(actionText: Button): Locator {
		return this.page
			.getByTestId("vault-submit-button")
			.filter({ hasText: actionText });
	}

	public get vaultDepositButton(): Locator {
		return this.vaultSubmitButtonByText(Button.DEPOSIT_TO_VAULT);
	}

	public get vaultWithdrawButton(): Locator {
		return this.vaultSubmitButtonByText(Button.WITHDRAW_FROM_VAULT);
	}

	public get cryptoWithdrawButton(): Locator {
		return this.page.getByTestId("LeftPanelMainButton");
	}

	public withdrawCryptoPaymentMethod(paymentMethod: string): Locator {
		return this.page.getByTestId(`witdrawal-crypto-${paymentMethod}`);
	}

	public depositCryptoPaymentMethod(paymentMethod: string): Locator {
		return this.page.getByTestId(`deposit-crypto-${paymentMethod}`);
	}

	public bankPaymentMethod(paymentMethod: string): Locator {
		return this.page.getByTestId(`${paymentMethod}PaymentMethodContainer`);
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

	public get selfExcludePanel(): Locator {
		return this.page.getByTestId("self-exclude-content-container");
	}

	public get depositDisabledText(): Locator {
		return this.selfExcludePanel.getByTestId("self-exclude-message-title");
	}

	public get cryptoDestinationTag(): Locator {
		return this.page.getByLabel("Your personal Destination Tag");
	}

	public get cryptoWithdrawDestinationTag(): Locator {
		return this.page.getByLabel("Destination Tag (optional)");
	}

	public get kycLevelOneCotainer(): Locator {
		return this.page.getByTestId("levelLEVEL1KycLeftPanelContainer");
	}

	public get veriffIFrameElement(): Locator {
		return this.page.locator("#veriffFrame");
	}

	public get kycLevelTwoHeader(): Locator {
		return this.page.getByTestId("levelLEVEL25KycLeftPanelContainer");
	}

	public get kycLevelThreeHeader(): Locator {
		return this.page.getByTestId("levelLEVEL3KycLeftPanelContainer");
	}

	public get networkDropdown(): Locator {
		return this.walletLeftPanel.getByTestId("Input");
	}

	public networkDropdownOption(dataValue: string): Locator {
		return this.page.locator(`li[data-value="${dataValue}"]`);
	}

	public withdrawalSpeedButton(speed: WithdrawalSpeed): Locator {
		return this.page.locator(`button[role="tab"]:has-text("${speed}")`);
	}

	public usdWithdrawAmountInput(): Locator {
		return this.page.getByLabel("USD to withdraw");
	}

	public withdrawAddressInput(): Locator {
		return this.page.locator('input[type="text"][placeholder*="Address"]');
	}

	public get networkFeeAmount(): Locator {
		return this.page
			.locator("span", { hasText: "The network fee is approximately" })
			.locator("..")
			.locator("span")
			.nth(1);
	}

	public get userIsVipText(): Locator {
		return this.page.locator(
			"span[class*='NetworkSpeedTabs-styled__VipBadgeText']",
		);
	}

	public get walletDepositWithdrawContainer(): Locator {
		return this.page.getByTestId("vault-tabs-container");
	}

	public get walletDropdown(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"vault-wallet-list-select-button",
		);
	}

	private get walletDropdownListbox(): Locator {
		return this.page.getByRole("listbox");
	}

	private get walletDropdownSelectOptions(): Locator {
		return this.walletDropdownListbox.locator(
			'[data-testid^="vault-wallet-list-select-option-"]',
		);
	}

	public walletDropdownOption(optionText: string): Locator {
		return this.walletDropdownSelectOptions.filter({
			hasText: optionText,
		});
	}

	private get selectedWalletButton(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"vault-wallet-list-select-button",
		);
	}

	public get vaultWalletAmount(): Locator {
		return this.selectedWalletButton
			.locator('p[data-testid="wallet-sec-txt"]')
			.filter({ hasText: currencyAmountPattern() });
	}

	public get vaultInputField(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"vault-amount-field-input-input",
		);
	}

	public get vaultSubmitButton(): Locator {
		return this.page.getByTestId("vault-submit-button");
	}

	public get vaultWithdrawTab(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"vault-withdraw-tab",
		);
	}

	public get vaultDepositTab(): Locator {
		return this.walletDepositWithdrawContainer.getByTestId(
			"vault-deposit-tab",
		);
	}

	public get vaultDepositToastMessage(): Locator {
		return this.page
			.getByTestId("toast-message-message")
			.getByText("transferred from your Wallet to your Vault");
	}

	public get vaultWithdrawToastMessage(): Locator {
		return this.page
			.getByTestId("toast-message-message")
			.getByText("transferred from your Vault to your Wallet");
	}
}
