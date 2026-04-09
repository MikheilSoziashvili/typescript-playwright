import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { DROPBOX_DOMAIN } from "@constants/domains";
import { AffiliatesInfoPage } from "./affiliates-info-page";

export class AffiliatesInfoPageAsserter extends BaseAsserter<AffiliatesInfoPage> {
	public constructor(page: AffiliatesInfoPage) {
		super(page);
	}

	@step("Check affiliates info page is displayed")
	public async pageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.heroTitle]);
	}

	@step("Check Download Templates button opens Dropbox in new tab")
	public async downloadTemplatesOpensDropboxInNewTab(): Promise<void> {
		await this.verifyNewTabUrlParts([DROPBOX_DOMAIN]);
	}

	@step("Check Gamdom Templates section is displayed")
	public async gamdomTemplatesSectionIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.gamdomTemplatesTitle,
			this.gamdomPage.map.gamdomTemplatesDescription,
			this.gamdomPage.map.downloadTemplatesButton,
		]);
	}

}
