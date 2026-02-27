import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { UserTags } from "@enums/db/user-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { BaseTestFlow } from "@test-flows/base/base-test-flow";
import { testFlow } from "decorators/test-flow";

export class FeatureActivationV4TestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Verify V4 feature activation state before and after login")
	public async verifyV4ActivationState(params: {
		v4BeforeLogin: boolean;
		v4AfterLogin: boolean;
		loginTags: UserTags[];
	}): Promise<void> {
		const { v4BeforeLogin, v4AfterLogin, loginTags } = params;

		const anonHomePage = this.browserSessionManager.getSession(
			TestUserRole.ANONYMOUS,
		).pages.homePage;
		await anonHomePage.navigate();
		await anonHomePage.assertThat().websiteV4StateIs(v4BeforeLogin);

		const userHomePage = (
			await this.browserSessionManager.loginAs(TestUserRole.REGULAR, {
				reuseContext: true,
				regularUserOptions: { tags: loginTags },
			})
		).pages.homePage;
		await userHomePage.navigate();
		await userHomePage.assertThat().websiteV4StateIs(v4AfterLogin);
	}
}
