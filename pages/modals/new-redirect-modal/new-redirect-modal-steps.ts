import { BasePageStep } from "@pages/base/base-page-step";
import { NewRedirectModal } from "./new-redirect-modal";
import { step } from "decorators/step";

export class NewRedirectModalSteps extends BasePageStep<NewRedirectModal> {
	public constructor(page: NewRedirectModal) {
		super(page);
	}

	@step()
	public async createNewRedirect(
		fromPath: string,
		toPath: string,
	): Promise<void> {
		await this.gamdomPage.fillRedirectFields(fromPath, toPath);
		await this.gamdomPage.clickCreateRedirectButton();
		await this.gamdomPage
			.assertThat()
			.newRedirectSuccessToastIsDispayed(fromPath, toPath);
	}

	@step()
	public async editRedirect(
		newFromPath: string,
		newToPath: string,
	): Promise<void> {
		await this.gamdomPage.fillRedirectFields(newFromPath, newToPath);
		await this.gamdomPage.clickEditRedirectButton();
		await this.gamdomPage
			.assertThat()
			.editRedirectSuccessToastIsDispayed(newFromPath, newToPath);
	}
}
