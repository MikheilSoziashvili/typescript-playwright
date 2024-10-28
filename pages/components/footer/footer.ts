import { Page } from "@playwright/test";
import { BaseComponent } from "../../base/base-component";
import { FooterAsserter } from "./footer-asserter";
import { FooterMap } from "./footer-map";
import { FooterSteps } from "./footer-steps";
import { step } from "decorators/step";

export class Footer extends BaseComponent<FooterMap> {
	constructor(page: Page) {
		super(page, new FooterMap(page));
	}

	public assertThat(): FooterAsserter {
		return new FooterAsserter(this);
	}

	public steps(): FooterSteps {
		return new FooterSteps(this);
	}

	@step()
	public async openFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.footerLinkByPlaceholder(footerLink).click();
	}

	@step()
	public async openSocialMediaFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.socialMediaFooterLinkByPlaceholder(footerLink).click();
	}
}
