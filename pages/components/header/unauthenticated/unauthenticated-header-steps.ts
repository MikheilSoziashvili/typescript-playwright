import { BaseComponentStep } from "@pages/base/base-component-step";
import { UnauthenticatedHeader } from "./unauthenticated-header";
import { step } from "decorators/step";
import { AuthenticationAction } from "enums/authentication-actions";

export class UnauthenticatedHeaderSteps extends BaseComponentStep<UnauthenticatedHeader> {
	public constructor(component: UnauthenticatedHeader) {
		super(component);
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
