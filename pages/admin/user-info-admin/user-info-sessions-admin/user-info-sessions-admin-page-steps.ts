import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoSessionsAdminPage } from "./user-info-sessions-admin-page";

export class UserInfoSessionsAdminPageSteps extends BasePageStep<UserInfoSessionsAdminPage> {
	public constructor(gamdomPage: UserInfoSessionsAdminPage) {
		super(gamdomPage);
	}
}
