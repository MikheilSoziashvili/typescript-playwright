import { WalletModalContent } from "@constants/wallet-modal-content";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";
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

	public get walletLeftPanelCryptoWithdrawHeader(): Locator {
		return this.walletLeftPanel.locator(
			'[class^="CryptoWithdrawPanel-styled__Head-"]',
		);
	}

	public get walletLeftPanelBankWithdrawHeader(): Locator {
		return this.walletLeftPanel.locator(
			'[class*="WithDrawPanel-styled__Head-"]',
		);
	}

	public get walletLeftPanelCryptoWithdrawHeaderTitle(): Locator {
		return this.walletLeftPanelCryptoWithdrawHeader.locator(
			'[class^="CryptoWithdrawPanel-styled__HeadWrapper"]',
		);
	}

	public get walletLeftPanelBankWithdrawHeaderTitle(): Locator {
		return this.walletLeftPanelBankWithdrawHeader.locator(
			'[class*="WithDrawPanel-styled__HeadWrapper"]',
		);
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

	public get withdrawTabContainer(): Locator {
		return this.page.locator(
			'[class^="Withdraw-styled__WithdrawContainer"]',
		);
	}

	public get withdrawEmailNotConfirmedContainer(): Locator {
		return this.walletLeftPanel.locator(
			'[class^="EmailNotVerifiedForWithdraw-styled__Container"]',
		);
	}

	public get withdrawEmailNotConfirmedIcon(): Locator {
		return this.withdrawEmailNotConfirmedContainer.locator(
			'g[clip-path="url(#email-not-verified_icon_svg__a)"]',
		);
	}

	public get withdrawEmailNotConfirmedTextSection(): Locator {
		return this.withdrawEmailNotConfirmedContainer.locator(
			'[class^="EmailNotVerifiedForWithdraw-styled__TextSection"]',
		);
	}

	public get withdrawEmailNotConfirmedTextSectionHeader(): Locator {
		return this.withdrawEmailNotConfirmedTextSection.locator("h5");
	}

	public get withdrawEmailNotConfirmedTextSectionContent(): Locator {
		return this.withdrawEmailNotConfirmedTextSection.locator("p");
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
		return this.withdrawTabContainer.locator(
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

	public get depositDisabledText(): Locator {
		return this.walletLeftPanel.locator("h5", {
			hasText: "Deposits Disabled",
		});
	}

	public get cryptoDestinationTag(): Locator {
		return this.page.getByLabel("Your personal Destination Tag");
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
}
