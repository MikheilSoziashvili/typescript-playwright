import {
	BrowserContext,
	Page,
	Browser,
	BrowserContextOptions,
} from "@playwright/test";
import { GamdomApiDbFacade } from "./facades/gamdom-api-db/gamdom-api-db-facade";
import { setAuthenticationCookies } from "./utils/utils";
import { AllGamdomPagesType, AllGamdomPages } from "@pages/index";
import { AuthenticatedUser } from "./facades/gamdom-api-db/interfaces";
import { TestUserRole } from "@enums/test-user-roles";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { ProxyCredentialsType } from "./types/types";

type Pages = {
	[K in keyof AllGamdomPagesType]: InstanceType<AllGamdomPagesType[K]>;
};

export class BrowserUserSession {
	private pageCache: Partial<Record<keyof AllGamdomPagesType, unknown>> = {};

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

	get pages(): {
		[K in keyof AllGamdomPagesType]: InstanceType<AllGamdomPagesType[K]>;
	} {
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
}

export class BrowserSessionManager {
	private sessions = new Map<TestUserRole, BrowserUserSession>();
	private _active: BrowserUserSession;
	private gamdomApiDbFacade: GamdomApiDbFacade;

	constructor(private browser: Browser, context: BrowserContext, page: Page) {
		const anon = new BrowserUserSession(
			TestUserRole.ANONYMOUS,
			context,
			page,
		);
		this.sessions.set(TestUserRole.ANONYMOUS, anon);
		this._active = anon;
		this.gamdomApiDbFacade = new GamdomApiDbFacade();
	}

	public async loginAs(
		role: TestUserRole,
		options?: {
			reuseContext?: boolean;
			proxyCredentials?: ProxyCredentialsType;
		},
	): Promise<BrowserUserSession> {
		const existingSession = this.sessions.get(role);
		if (existingSession && !options?.proxyCredentials) {
			this._active = existingSession;
			return this._active;
		}

		const { context, page } = await this.getOrCreateContext(options);
		const authenticatedUser = await this.authenticateUser(role, page);

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
				await this.safeCloseContext(session.context);
			}
		}
		this.sessions.clear();
	}

	private async getOrCreateContext(options?: {
		reuseContext?: boolean;
		proxyCredentials?: ProxyCredentialsType;
	}): Promise<{ context: BrowserContext; page: Page }> {
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
		const page = await context.newPage();

		return { context, page };
	}

	private async authenticateUser(
		role: TestUserRole,
		page: Page,
	): Promise<AuthenticatedUser | undefined> {
		switch (role) {
			case TestUserRole.ANONYMOUS:
				return undefined;

			case TestUserRole.REGULAR: {
				const userAuth =
					await this.gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			case TestUserRole.SUPERADMIN: {
				const userAuth =
					await this.gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
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
				await setAuthenticationCookies(page, userAuth.cookie);
				return userAuth;
			}

			default:
				throw new Error(
					`Unsupported user role for authentication detected`,
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
