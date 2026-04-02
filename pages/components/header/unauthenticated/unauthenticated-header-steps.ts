import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { BaseComponentStep } from "@pages/base/base-component-step";
import { step } from "decorators/step";
import { AuthenticationAction } from "enums/authentication-actions";
import { UnauthenticatedHeader } from "./unauthenticated-header";

export class UnauthenticatedHeaderSteps extends BaseComponentStep<UnauthenticatedHeader> {
	public constructor(component: UnauthenticatedHeader) {
		super(component);
	}

	@step("Click Create Account and verify jurisdiction toast")
	public async clickCreateAccountAndVerifyJurisdictionToast(): Promise<void> {
		await this.component.openRegisterModal();
		await this.component.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SYSTEM,
				ToastSubTitle.JURISDICTION_RESTRICTED,
			);
	}

	@step("Verify social login options are visible")
	public async verifySocialLoginOptionsVisible(
		signIn: AuthenticationAction,
	): Promise<void> {
		const modalActions = {
			[AuthenticationAction.LOG_IN]: () =>
				this.component.openLoginModal(),
			[AuthenticationAction.SIGN_UP]: () =>
				this.component.openRegisterModal(),
		};

		await modalActions[signIn]();
		await this.component.assertThat().socialLoginOptionsAreVisible();
	}
}
