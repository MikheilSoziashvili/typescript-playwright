import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class FooterMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get footerContainer(): Locator {
		return this.page.getByTestId("footer-v4");
	}

	public get footerLinksSection(): Locator {
		return this.footerContainer.getByTestId("footer-links-section");
	}

	public footerLinkByPlaceholder(placeholderText: string): Locator {
		return this.footerLinksSection.locator("a, button", {
			hasText: placeholderText,
		});
	}

	public get footerSocialButtons(): Locator {
		return this.page.getByTestId("footer-social-buttons");
	}

	public socialMediaFooterLinkByPlaceholder(
		socialMediaText: string,
	): Locator {
		return this.footerSocialButtons.getByTestId(
			`footer-social-buttons-${socialMediaText.trim().toLowerCase()}-link`,
		);
	}

	public socialMediaFooterIconByPlaceholder(
		socialMediaText: string,
	): Locator {
		return this.footerSocialButtons.getByTestId(
			`footer-social-buttons-${socialMediaText.trim().toLowerCase()}-icon`,
		);
	}

	public get liveSupportButton(): Locator {
		return this.footerLinksSection.locator(
			'button[data-testid="footer-support-link-live-support"]',
		);
	}

	public get affiliatesFooterButton(): Locator {
		return this.footerLinksSection.locator(
			'a[data-testid="footer-promotional-link-affiliates"]',
		);
	}
}
