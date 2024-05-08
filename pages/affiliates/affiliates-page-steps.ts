import { BasePageStep } from "core/helpers/base-page-step";
import { AffiliatesPage } from "./affiliates-page";

export class AffiliatesPageSteps extends BasePageStep<AffiliatesPage> {
	public constructor(gamdomPage: AffiliatesPage) {
		super(gamdomPage);
	}

	public async addCode(code: string): Promise<void> {
		await this.gamdomPage.addNewCode(code);
		await this.gamdomPage.assertThat().isCreatedAffiliateCodeVisible(code);
		await this.gamdomPage
			.assertThat()
			.isCreatedAffiliateCodeVisibleInCopyToClipboardField(code);
	}
}
