import {
	BrowserContext,
	Page,
	Browser,
	BrowserContextOptions,
} from "@playwright/test";
import { GamdomApiDbFacade } from "./facades/gamdom-api-db/gamdom-api-db-facade";
import { setAuthenticationCookies } from "./utils/utils";
import { CmsApi } from "@api/cms-api";
import { AllGamdomPagesType, AllGamdomPages } from "@pages/index";
import { AuthenticatedUser } from "./facades/gamdom-api-db/interfaces";
import { TestUserRole } from "@enums/test-user-roles";
import { UserClasses } from "@enums/db/user-classes";
import { autoDismissCookieBanner, cookieConsent } from "configuration";
import { UserTags } from "@enums/db/user-tags";
import { AllApis, AllApisType, ApiFactories } from "@api/index";
import { BaseApi } from "@api/base-api";
import {
	StorageStateAwareApi,
	ApiPromises,
	Pages,
	BrowserSessionLoginOptions,
	SessionContextOptions,
} from "./types/browser-session-mngmt-types";
import { UserBalanceHandler } from "./handlers/user-balance-handler/user-balance-handler";

function isStorageStateAwareApi(api: unknown): api is StorageStateAwareApi {
	if (typeof api !== "object" || api === null) {
		return false;
	}

	return (
		"addContextStorageState" in api &&
		typeof (api as { addContextStorageState?: unknown })
			.addContextStorageState === "function"
	);
}

export class BrowserUserSession {
	private apiCache: Partial<Record<keyof AllApisType, Promise<unknown>>> = {};
	private pageCache: Partial<Record<keyof AllGamdomPagesType, unknown>> = {};

	private _userBalanceHandler?: UserBalanceHandler;

	constructor(
		public role: TestUserRole,
		public context: BrowserContext,
		public page: Page,
		public authenticatedUser?: AuthenticatedUser,
	) {}

	public getAuthenticatedUser(): AuthenticatedUser {
		if (this.authenticatedUser === undefined) {
			throw new Error("No logged in active user exists");
		}

		return this.authenticatedUser;
	}

	public reset(
		context: BrowserContext,
		page: Page,
		authenticatedUser?: AuthenticatedUser,
	): void {
		this.context = context;
		this.page = page;
		this.authenticatedUser = authenticatedUser;
		this.pageCache = {};
	}

	get apis(): ApiPromises {
		return new Proxy({} as ApiPromises, {
			get: <K extends keyof AllApisType>(
				_target: ApiPromises,
				prop: K,
			) => {
				if (!Object.prototype.hasOwnProperty.call(AllApis, prop)) {
					throw new Error(
						`API "${String(prop)}" not found in registry`,
					);
				}

				const cached = this.apiCache[prop];
				if (cached) {
					return cached;
				}

				const created = this.createApi(prop);
				this.apiCache[prop] = created;

				return created;
			},
		});
	}

	private createApi<K extends keyof AllApisType>(prop: K): ApiPromises[K] {
		return (async () => {
			// instantiate API class (special constructor (like CurrencyApi) if present, else default constructor)
			const api =
				prop in ApiFactories
					? (ApiFactories[prop as keyof typeof ApiFactories](
							this.page,
						) as InstanceType<AllApisType[K]>)
					: new (AllApis[prop] as unknown as new () => InstanceType<
							AllApisType[K]
						>)();

			const storageState = await this.context.storageState();
			if (isStorageStateAwareApi(api)) {
				await api.addContextStorageState(storageState);
			}

			return api;
		})() as ApiPromises[K];
	}

	get pages(): Pages {
		return new Proxy({} as Pages, {
			get: <K extends keyof AllGamdomPagesType>(
				_target: Pages,
				prop: K,
			): InstanceType<AllGamdomPagesType[K]> => {
				if (
					!Object.prototype.hasOwnProperty.call(AllGamdomPages, prop)
				) {
					throw new Error(
						`Page "${String(prop)}" not found in registry`,
					);
				}

				// Return cached instance if present
				if (this.pageCache[prop]) {
					return this.pageCache[prop] as InstanceType<
						AllGamdomPagesType[K]
					>;
				}

				const PageClass = AllGamdomPages[prop] as new (
					page: Page,
				) => InstanceType<AllGamdomPagesType[K]>;

				const instance = new PageClass(this.page);
				this.pageCache[prop] = instance;

				return instance;
			},
		});
	}

	public async userBalanceHandler(): Promise<UserBalanceHandler> {
		if (this._userBalanceHandler) return this._userBalanceHandler;

		const currencyApi = await this.apis.currencyApi;

		const handler = new UserBalanceHandler(this.page, currencyApi);
		this._userBalanceHandler = handler;

		return handler;
	}

	public async disposeApis(): Promise<void> {
		for (const apiPromise of Object.values(this.apiCache)) {
			try {
				const api = await apiPromise;
				if (typeof (api as BaseApi).dispose === "function") {
					await (api as BaseApi).dispose();
				}
			} catch {
				// ignore api disposal failures
			}
		}
		this.apiCache = {};
	}
}

export class BrowserSessionManager {
	private sessions = new Map<TestUserRole, BrowserUserSession>();
	private _active: BrowserUserSession;
	private gamdomApiDbFacade: GamdomApiDbFacade;

	constructor(
		private browser: Browser,
		context: BrowserContext,
		page: Page,
	) {
		const anon = new BrowserUserSession(
			TestUserRole.ANONYMOUS,
			context,
			page,
		);
		this.sessions.set(TestUserRole.ANONYMOUS, anon);
		this._active = anon;
		this.gamdomApiDbFacade = new GamdomApiDbFacade();
	}

	public async userBalanceHandler(): Promise<UserBalanceHandler> {
		return this.active.userBalanceHandler();
	}

	public async loginAs(
		role: TestUserRole,
		options?: BrowserSessionLoginOptions,
	): Promise<BrowserUserSession> {
		const existingSession = this.sessions.get(role);
		const hasRegularUserOverrides =
			role === TestUserRole.REGULAR &&
			options?.regularUserOptions !== undefined;

		const canReuseExistingSession =
			existingSession !== undefined &&
			!options?.proxyCredentials &&
			!hasRegularUserOverrides;

		if (canReuseExistingSession) {
			this._active = existingSession;
			return this._active;
		}

		const { context, page } = await this.getOrCreateContext(options);
		const authenticatedUser = await this.authenticateUser(
			role,
			page,
			options,
		);

		if (existingSession !== undefined && !options?.proxyCredentials) {
			existingSession.reset(context, page, authenticatedUser);
			this._active = existingSession;
			return existingSession;
		}

		const session = this.createSession(
			role,
			context,
			page,
			authenticatedUser,
		);

		return session;
	}

	public get active(): BrowserUserSession {
		return this._active;
	}

	public getSession(role: TestUserRole): BrowserUserSession {
		const session = this.sessions.get(role);
		if (session === undefined) {
			throw new Error(
				`Browser session for test user role '${role}' does not exist`,
			);
		}

		return session;
	}

	public get activeUser(): AuthenticatedUser {
		if (this._active.authenticatedUser === undefined) {
			throw new Error("No logged in active user exists");
		}

		return this._active.authenticatedUser;
	}

	public get activeRole(): TestUserRole {
		return this._active.role;
	}

	public getUser(role: TestUserRole): AuthenticatedUser | undefined {
		return this.sessions.get(role)?.authenticatedUser;
	}

	public async cleanup(): Promise<void> {
		for (const [role, session] of this.sessions.entries()) {
			if (role !== TestUserRole.ANONYMOUS) {
				await session.disposeApis();
				await this.safeCloseContext(session.context);
			}
		}
		this.sessions.clear();
	}

	private async getOrCreateContext(
		options?: SessionContextOptions,
	): Promise<{ context: BrowserContext; page: Page }> {
		const shouldReuse = options?.reuseContext && !options.proxyCredentials;

		if (shouldReuse) {
			const context = this._active.context;
			const page = this._active.page;

			await context.clearCookies();
			await page.context().clearPermissions();
			return { context, page };
		}

		const contextOptions: BrowserContextOptions = {};

		if (options?.proxyCredentials) {
			contextOptions.proxy = options.proxyCredentials;
		}

		const context = await this.browser.newContext(contextOptions);
		if (autoDismissCookieBanner) {
			await context.addInitScript(
				({ key, value }) => localStorage.setItem(key, value),
				cookieConsent,
			);
		}
		const page = await context.newPage();

		return { context, page };
	}

	private async authenticateUser(
		role: TestUserRole,
		page: Page,
		options?: BrowserSessionLoginOptions,
	): Promise<AuthenticatedUser | undefined> {
		switch (role) {
			case TestUserRole.ANONYMOUS:
				return undefined;

			case TestUserRole.REGULAR: {
				const userAuth =
					await this.gamdomApiDbFacade.createSingleUserDbAndAuth(
						options?.regularUserOptions,
					);
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.SUPERADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.ADMIN_CRYPTOSUPADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: false,
						tags: [
							UserTags.CryptoSupAdmin,
							UserTags.CryptoAdmin,
							UserTags.CryptoViewOnlyAdmin,
							UserTags.UserInfoCryptoAdmin,
						],
						userClass: UserClasses.Admin,
					});
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.ADMIN_USER_INFO_ADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: false,
						tags: UserTags.UserInfoAdmin,
						userClass: UserClasses.Admin,
					});
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.ADMIN_SPORTS_BLOG_ADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: false,
						tags: UserTags.SportsBlogAdmin,
						userClass: UserClasses.Admin,
					});
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.ADMIN_PROMOTIONS_ADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: false,
						tags: UserTags.PromotionAdmin,
						userClass: UserClasses.Admin,
					});
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO: {
				const userAuth =
					await this.gamdomApiDbFacade.createAdminUserDbAndAuth({
						emailVerified: true,
						useGamdomEmailDomain: false,
						tags: [
							UserTags.EvRewardsSystemSuperAdmin,
							UserTags.EvRewardsSystemAdmin,
							UserTags.UserInfoAdmin,
						],
						userClass: UserClasses.Admin,
					});
				await this.setUserWalletOptions(userAuth, options);
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.CMS_SUPERADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				const cmsApi = new CmsApi();
				const setCookie = await cmsApi.loginAsCmsAdmin(
					userAuth.user.username,
					userAuth.user.password,
				);
				await setAuthenticationCookies(page, setCookie);
				return userAuth;
			}

			default:
				throw new Error(
					`Unsupported user role for authentication detected`,
				);
		}
	}

	private async setUserWalletOptions(
		userAuth: AuthenticatedUser,
		options?: BrowserSessionLoginOptions,
	): Promise<void> {
		if (options?.regularUserWalletOptions) {
			await this.gamdomApiDbFacade.upsertUserWalletsDb(
				userAuth.user.userId,
				options.regularUserWalletOptions.walletUnits,
				options.regularUserWalletOptions.amount,
			);
		}
	}

	private createSession(
		role: TestUserRole,
		context: BrowserContext,
		page: Page,
		authenticatedUser?: AuthenticatedUser,
	): BrowserUserSession {
		const session = new BrowserUserSession(
			role,
			context,
			page,
			authenticatedUser,
		);
		this.sessions.set(role, session);
		this._active = session;
		return session;
	}

	private async safeCloseContext(context: BrowserContext): Promise<void> {
		try {
			await context.close();
		} catch {
			// Context may already be closed, ignore
		}
	}
}

/**
 * Session-aware page fixture factory.
 * Every page fixture uses the current active session’s page.
 */
export function sessionAwarePage<T>(
	PageClass: new (page: Page) => T,
): (
	args: { browserSessionManager: BrowserSessionManager },
	use: (page: T) => Promise<void>,
) => Promise<void> {
	return async (
		{
			browserSessionManager,
		}: { browserSessionManager: BrowserSessionManager },
		use: (page: T) => Promise<void>,
	) => {
		const instance = new PageClass(browserSessionManager.active.page);
		await use(instance);
	};
}
