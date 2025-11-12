import { BaseMap } from "@pages/base/base-map";
import { Page, Locator } from "@playwright/test";

export class VeriffPortalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get emailInput(): Locator {
		return this.page.locator("[data-test-id='conventionalEmail']");
	}

	public get passwordInput(): Locator {
		return this.page.locator("input[type='password']");
	}

	public get loginButton(): Locator {
		return this.page.locator("button[type='submit']");
	}

	public get multiFactorAuthInput(): Locator {
		return this.page.locator("input[name='code']");
	}

	public get verificationPageTitle(): Locator {
		return this.page.locator("[data-test-id='verificationPage']");
	}

	public get sessionListTable(): Locator {
		return this.page.locator("table");
	}

	public openVerificationLink(vendorData: string): Locator {
		return this.page
			.locator("tr")
			.filter({ hasText: vendorData })
			.locator("a", { hasText: "Not available" });
	}

	public verificationStatusInTable(vendorData: string): Locator {
		return this.page
			.locator("tr")
			.filter({ hasText: vendorData })
			.locator('td [data-test-id="sessionStatus"]');
	}

	public get vendorData(): Locator {
		return this.page.locator("[data-test-id='sessionInfo-Vendor_Data']");
	}

	public get sessionStatus(): Locator {
		return this.page.locator("[data-test-id='sessionStatus']");
	}

	public get updateStatusButton(): Locator {
		return this.page.locator("[data-test-id='updateStatus']");
	}

	public get statusDropdown(): Locator {
		return this.page.locator("[data-test-id='statusSelect']");
	}

	public get reasonDropdown(): Locator {
		return this.page.locator("[data-test-id='categorySelect']");
	}

	public get dropdownOptions(): Locator {
		return this.page.getByRole("option");
	}

	public get confirmUpdateStatusButton(): Locator {
		return this.page.locator("[data-test-id='submitUpdateStatus']");
	}

	public get selectedReason(): Locator {
		return this.page.locator("[data-test-id='reason']");
	}

	public get cookieConsentDialog(): Locator {
		return this.page.getByRole("dialog");
	}

	public get acceptAllCookiesButton(): Locator {
		return this.page.locator("[data-test-id='acceptAllButton']");
	}
}
