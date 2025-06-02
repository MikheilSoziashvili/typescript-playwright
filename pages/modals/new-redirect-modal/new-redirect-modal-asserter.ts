import { BaseAsserter } from "@base/base-asserter";
import { NewRedirectModal } from "./new-redirect-modal";
import { step } from "decorators/step";
import {
	buildEditedRedirectFromToSubTitle,
	buildNewRedirectFromToSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";
import { ToastTitle } from "@enums/toast-titles";

export class NewRedirectModalAsserter extends BaseAsserter<NewRedirectModal> {
	public constructor(page: NewRedirectModal) {
		super(page);
	}

	@step("New Redirect modal is displayed")
	public async newRedirectModalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.newRedirectModalTitle,
		]);
	}

	@step("New Redirect Success toast is displayed")
	public async newRedirectSuccessToastIsDispayed(
		redirectFrom: string,
		redirectTo: string,
	): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(
				buildNewRedirectFromToSubTitle(redirectFrom, redirectTo),
			);
	}

	@step("Redirect updated Success toast is displayed")
	public async editRedirectSuccessToastIsDispayed(
		redirectFrom: string,
		redirectTo: string,
	): Promise<void> {
		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await this.gamdomPage.toast
			.assertThat()
			.subTitleIs(
				buildEditedRedirectFromToSubTitle(redirectFrom, redirectTo),
			);
	}
}
