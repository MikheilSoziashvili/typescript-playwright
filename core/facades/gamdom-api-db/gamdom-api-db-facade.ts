import { GamdomApi } from "@api/gamdom-api";
import { RegisterTestData } from "@dtos/test-data";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { GamdomDb } from "database/gamdom-db";
import {
	AuthenticatedUser,
	CreateUsersWithAmlLevelsOptions,
	UserData,
} from "./interfaces";
import { Unit } from "@enums/units";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { DEFAULT_IMAGE } from "@constants/defaults";

export class GamdomApiDbFacade {
	private gamdomApi: GamdomApi;
	private gamdomDb: GamdomDb;

	constructor() {
		this.gamdomApi = new GamdomApi();
		this.gamdomDb = new GamdomDb();
	}

	/**
	 * Creates a specified number of users directly in the database,
	 * optionally verifying their emails.
	 *
	 * @param options - Configuration object
	 * @param options.usersCount - Number of users to create
	 * @param options.emailVerified - Whether to create the user with email verified
	 * @param options.updateUserEmailVerification - Whether to additionaly verify email
	 * @param options.useGamdomEmailDomain - User's email to be of gamdom domain
	 * @param options.email - Use custom provided email
	 * @param options.tags - User tags
	 * @param options.userClass - User class
	 * @returns A list of created users including their DB-generated userId
	 */
	public async createUsersDb(options: {
		usersCount: number;
		emailVerified?: boolean;
		updateUserEmailVerification?: boolean;
		email?: string | string[];
		image?: string;
		amount?: number;
		unit?: Unit;
		startingXp?: number;
		tags?: UserTags[] | UserTags;
		userClass?: UserClasses;
	}): Promise<UserData[]> {
		const {
			usersCount,
			emailVerified = true,
			updateUserEmailVerification = false,
			email,
			image = DEFAULT_IMAGE,
			amount = 10000000,
			unit = Unit.COINS,
			startingXp = 10001200,
			tags,
			userClass,
		} = options;
		const testUsers = Array.from({ length: usersCount }, (_, i) => {
			const overrideEmail =
				email !== undefined && Array.isArray(email) ? email[i] : email;
			return new RegisterTestData({ email: overrideEmail });
		});

		const userData: UserData[] = await Promise.all(
			testUsers.map(async (user) => {
				const baseUserData = {
					username: user.username,
					password: user.password,
					email: user.email,
					emailVerified: emailVerified,
					image: image,
					amount: amount,
					unit: unit,
					startingXp: startingXp,
					tags: tags,
					userClass: userClass,
				};

				const userId = await this.gamdomDb.createNewUser(baseUserData);

				return {
					userId,
					...baseUserData,
				};
			}),
		);

		if (updateUserEmailVerification) {
			await Promise.all(
				userData.map((user) =>
					this.gamdomDb.updateUserEmailVerification(user.userId),
				),
			);
		}

		return userData;
	}

	/**
	 * Creates users and automatically assigns them AML levels based on input.
	 * All users will have their email verified.
	 *
	 * @param options - Object containing users with their associated AML levels
	 * @returns A list of created users with their assigned AML levels
	 */
	public async createUsersWithAmlLevelsDb(
		options: CreateUsersWithAmlLevelsOptions,
	): Promise<UserData[]> {
		const usersCount = options.users.length;

		const createdUsers = await this.createUsersDb({
			usersCount: usersCount,
			updateUserEmailVerification: true,
		});

		const usersWithLevels = createdUsers.map((user, index) => ({
			userId: user.userId,
			level: options.users[index].level,
		}));

		await this.assignAmlLevelsDb(usersWithLevels);

		return createdUsers;
	}

	/**
	 * Assigns AML verification levels to the given users in the database.
	 *
	 * @param users - Array of user IDs and their corresponding AML levels
	 */
	public async assignAmlLevelsDb(
		users: { userId: number; level: AmlVerificationLevel }[],
	): Promise<void> {
		await Promise.all(
			users.map((user) =>
				this.gamdomDb.insertDefaultAmlStatusByLevel(
					user.userId,
					user.level,
				),
			),
		);
	}

	/**
	 * Upserts wallet balances for a user.
	 *
	 * @param userId - The user's user id
	 * @param walletUnits - Wallet units/currencies to upsert
	 * @param amount - Amount to set for each wallet
	 */
	public async upsertUserWalletsDb(
		userId: number,
		walletUnits: Unit[],
		amount: number,
	): Promise<void> {
		await Promise.all(
			walletUnits.map((unit) =>
				this.gamdomDb.upsertUserWallet(userId, unit, amount),
			),
		);
	}

	/**
	 * Create a single user, upsert wallet balances,
	 * and authenticate the user.
	 *
	 * @param options - Operation options.
	 * @param options.walletUnits - Wallet units/currencies to upsert for the user (e.g., ["USD", "EUR"] or enum values).
	 * @param options.amount - Balance amount to set for each wallet unit.
	 * @param options.verifyEmail - When true, marks the user's email as verified during creation (default: `false`).
	 *
	 * @returns An object containing:
	 * - `user` — The created user with `userId`, `username`, `password`, `email`, and `emailVerified`.
	 * - `cookie` — The authentication cookie/token returned by the API.
	 */
	public async createUserWithWalletsAndAuth(options: {
		walletUnits: Unit[];
		amount: number;
		verifyEmail?: boolean;
	}): Promise<AuthenticatedUser> {
		const { walletUnits, amount, verifyEmail = false } = options;

		const [user] = await this.createUsersDb({
			usersCount: 1,
			updateUserEmailVerification: verifyEmail,
		});

		await this.upsertUserWalletsDb(user.userId, walletUnits, amount);

		const cookie = await this.gamdomApi.authenticateWithExistingUser(
			user.username,
			user.password,
		);

		return { user, cookie };
	}

	/**
	 * Creates exactly one user in the database and then authenticates that user.
	 *
	 * @param options - Operation options.
	 * @param options.emailVerified - Whether to create the user with email verified
	 * @param options.updateUserEmailVerification - Whether to additionaly verify email
	 * @param options.useGamdomEmailDomain - User's email to be of gamdom domain
	 * @param options.email - Use custom provided email
	 * @param options.tags - User tags
	 * @param options.userClass - User class
	 *
	 * @returns An object containing:
	 * - `user` — The created user with `userId`, `username`, `password`, `email`, and `emailVerified`.
	 * - `cookie` — The authentication cookie/token returned by the API.
	 */
	public async createSingleUserDbAndAuth(options?: {
		emailVerified?: boolean;
		updateUserEmailVerification?: boolean;
		useGamdomEmailDomain?: boolean;
		email?: string;
		image?: string;
		amount?: number;
		unit?: Unit;
		startingXp?: number;
		tags?: UserTags[] | UserTags;
		userClass?: UserClasses;
	}): Promise<AuthenticatedUser> {
		const emailVerified = options?.emailVerified ?? true;
		const updateUserEmailVerification =
			options?.updateUserEmailVerification ?? false;
		const customEmail = options?.email ?? undefined;

		const [user] = await this.createUsersDb({
			usersCount: 1,
			emailVerified: emailVerified,
			updateUserEmailVerification: updateUserEmailVerification,
			email: customEmail,
			image: options?.image,
			amount: options?.amount,
			unit: options?.unit,
			startingXp: options?.startingXp,
			tags: options?.tags,
			userClass: options?.userClass,
		});

		const cookie = await this.gamdomApi.authenticateWithExistingUser(
			user.username,
			user.password,
		);

		return { user, cookie };
	}

	/**
	 * Creates a superadmin user in the database and then authenticates it.
	 *
	 * @param options - Operation options.
	 * @param options.emailVerified - Whether to create the user with email verified (default `true`)
	 * @param options.useGamdomEmailDomain - User's email to be of gamdom domain (default `true`)
	 * @returns An object containing:
	 * - `user` — The created user with `userId`, `username`, `password`, `email`, and `emailVerified`.
	 * - `cookie` — The authentication cookie/token returned by the API.
	 */
	public async createSuperAdminUserDbAndAuth(options?: {
		emailVerified?: boolean;
		useGamdomEmailDomain?: boolean;
	}): Promise<AuthenticatedUser> {
		const emailVerified = options?.emailVerified ?? true;
		const useGamdomEmailDomain = options?.useGamdomEmailDomain ?? true;

		return this.createSingleUserDbAndAuth({
			emailVerified: emailVerified,
			useGamdomEmailDomain: useGamdomEmailDomain,
			tags: [UserTags.SuperAdmin],
			userClass: UserClasses.Admin,
		});
	}
}
