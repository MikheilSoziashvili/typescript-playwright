import { GamdomApi } from "@api/gamdom-api";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { GamdomApiDbFacade } from "@core/facades/gamdom-api-db/gamdom-api-db-facade";
import { encodeCookieHeader, parseCurrencyToNumber } from "@core/utils/utils";
import { TestUserRole } from "@enums/test-user-roles";
import { BaseTestFlow, testFlow } from "@test-flows";
import { LOW_USER_AMOUNT } from "database/constants/user-amounts";

export class WagerRequirementTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Setup user with wager requirement")
	public async setupUserWithWagerRequirement(params: {
		browserSessionManager: BrowserSessionManager;
		gamdomApi: GamdomApi;
		gamdomApiDbFacade: GamdomApiDbFacade;
		wagerReqEndCoins: number;
	}): Promise<BrowserUserSession> {
		const {
			browserSessionManager,
			gamdomApi,
			gamdomApiDbFacade,
			wagerReqEndCoins,
		} = params;

		const user = await browserSessionManager.loginAs(TestUserRole.REGULAR, {
			reuseContext: true,
			regularUserOptions: { amount: LOW_USER_AMOUNT },
		});

		const { userId, email } = user.getAuthenticatedUser().user;

		const { cookie: superAdminCookie } =
			await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
		const adminHeaders = {
			Cookie: await encodeCookieHeader(superAdminCookie),
		};

		await gamdomApi.editUserInfo(Number(userId), "", email, adminHeaders, {
			wager_req_end: wagerReqEndCoins,
		});

		return user;
	}

	@testFlow("Verify wager requirement popup presence and drag behaviour")
	public async verifyPopupPresenceAndDrag(params: {
		user: BrowserUserSession;
		message: string;
		targetAmountDollars: string;
		dragTargetX: number;
		dragTargetY: number;
	}): Promise<void> {
		const { user, message, targetAmountDollars, dragTargetX, dragTargetY } =
			params;

		await user.pages.homePage.navigate();

		await user.pages.wagerRequirementPopup
			.assertThat()
			.collapsedPopupIsDisplayed();
		await user.pages.wagerRequirementPopup
			.steps()
			.dragPopupAndVerifyMoved(dragTargetX, dragTargetY);
		await user.pages.wagerRequirementPopup
			.steps()
			.expandPopupAndVerifyContent(message);
		await user.pages.wagerRequirementPopup
			.assertThat()
			.targetAmountIs(targetAmountDollars);
	}

	@testFlow("Place bet and verify wagered amount increased")
	public async placeBetAndVerifyProgressUpdated(params: {
		user: BrowserUserSession;
		betAmount: number;
		autoCashOut: number;
	}): Promise<void> {
		const { user, betAmount, autoCashOut } = params;

		await user.pages.wagerRequirementPopup
			.assertThat()
			.expandedContentIsDisplayed();
		const wageredAmountBefore =
			await user.pages.wagerRequirementPopup.getWageredAmountText();

		const crashApi = await user.apis.crashApi;
		await crashApi.placeBetUntilSuccessful(betAmount, autoCashOut);

		await user.pages.homePage.navigate();
		await user.pages.wagerRequirementPopup.clickToggleButton();
		await user.pages.wagerRequirementPopup
			.assertThat()
			.expandedContentIsDisplayed();

		const wageredAmountAfter =
			await user.pages.wagerRequirementPopup.getWageredAmountText();

		await user.pages.wagerRequirementPopup
			.assertThat()
			.wageredAmountIncreased(
				parseCurrencyToNumber(wageredAmountBefore),
				parseCurrencyToNumber(wageredAmountAfter),
			);
	}

	@testFlow("Fulfill wager requirement and verify popup disappears")
	public async fulfillWagerRequirementAndVerifyPopupDisappears(params: {
		user: BrowserUserSession;
		betAmount: number;
		autoCashOut: number;
	}): Promise<void> {
		const { user, betAmount, autoCashOut } = params;

		const crashApi = await user.apis.crashApi;
		await crashApi.placeBetUntilSuccessful(betAmount, autoCashOut);

		await user.pages.homePage.navigate();

		await user.pages.wagerRequirementPopup.assertThat().popupIsNotVisible();
	}
}
