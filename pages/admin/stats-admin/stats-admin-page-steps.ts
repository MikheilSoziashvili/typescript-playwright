import { BasePageStep } from "@pages/base/base-page-step";
import { StatsAdminPage } from "./stats-admin-page";

export class StatsAdminSteps extends BasePageStep<StatsAdminPage> {
	public constructor(page: StatsAdminPage) {
		super(page);
	}
}
