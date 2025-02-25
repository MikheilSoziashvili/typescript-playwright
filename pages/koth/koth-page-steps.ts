import { BasePageStep } from "@pages/base/base-page-step";
import { KothPage } from "./koth-page";

export class KothSteps extends BasePageStep<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}
}
