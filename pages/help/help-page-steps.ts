import { BasePageStep } from "@pages/base/base-page-step";
import { HelpPage } from "./help-page";

export class HelpPageSteps extends BasePageStep<HelpPage> {
	public constructor(gamdomPage: HelpPage) {
		super(gamdomPage);
	}
}
