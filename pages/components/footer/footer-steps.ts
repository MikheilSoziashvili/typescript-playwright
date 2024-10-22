import { BaseComponentStep } from "@pages/base/base-component-step";
import { AuthenticatedHeader } from "../header/authenticated/authenticated-header";
import { Footer } from "./footer";

export class FooterSteps extends BaseComponentStep<Footer> {
	private authenticatedHeader: AuthenticatedHeader;

	public constructor(component: Footer) {
		super(component);
		this.authenticatedHeader = this.createAuthenticatedHeader();
	}

	private createAuthenticatedHeader(): AuthenticatedHeader {
		return new AuthenticatedHeader(this.component.page);
	}
}
