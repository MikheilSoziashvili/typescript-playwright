import * as Configuration from "configuration";
import { Pool, QueryResultRow } from "pg";
import { BaseDB } from "./base-db";
import { DbTables } from "@enums/db/db-tables";
import { UsersColumns } from "@enums/db/users-columns";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { Unit } from "@enums/units";
import { WalletsColumns } from "@enums/db/wallets-columns";
import {
	convertToScryptHash,
	formatDate,
	formatUserTags,
	getRandomPhone,
} from "@core/utils/utils";
import { CampaignsColumns } from "@enums/db/campaigns-columns";
import { WithdrawLimitsSettingsValues } from "@enums/db/withdraw-settings-values";
import { SettingsColumns } from "@enums/db/settings-columns";
import { WalletUnit } from "@core/types/types";
import { NewUserOptions } from "@core/api/interfaces/storage-state-new-user-options";
import { DEFAULT_IMAGE } from "@constants/defaults";

export class GamdomDb extends BaseDB {
	constructor() {
		super();
		this.pool = new Pool(Configuration.poolConfig);
	}

	public async getUserInfoById(userId: number): Promise<QueryResultRow[]> {
		const userInfo = await this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Id} = $1`,
			[userId],
		);
		return userInfo;
	}

	public async getUserInfoByUsername(
		username: string,
		hasLogMessage = true,
	): Promise<QueryResultRow[]> {
		const userInfo = await this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Username} = $1`,
			[username],
			hasLogMessage,
		);
		return userInfo;
	}

	public async makeUserSuperAdmin(userId: number): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{
				[UsersColumns.Tags]: UserTags.SuperAdmin,
				[UsersColumns.UserClass]: UserClasses.Admin,
			},
			`${UsersColumns.Id} = ${userId}`,
		);
		return result;
	}

	public async updateUserTotalDepositedAmountByUserEmail(
		userEmail: string,
		amount = 300,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
		);
		return result;
	}

	public async updateUserTotalDepositedAmountByUserId(
		userId: number,
		amount = 300,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Id} = ${userId}`,
		);
		return result;
	}

	public async updateUserEmailVerification(
		userId: number,
		isVerified = true,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.EmailVerified]: isVerified },
			`${UsersColumns.Id} = ${userId}`,
		);
		return result;
	}

	public async insertUserWallet(
		userId: number,
		unit: WalletUnit = Unit.COINS,
		balance = 10000000,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const result = await this.insert(
			DbTables.Wallets,
			{
				[WalletsColumns.UserId]: userId,
				[WalletsColumns.Unit]: unit,
				[WalletsColumns.Balance]: balance,
			},
			hasLogMessage,
		);
		return result;
	}

	public async updateUserXP(
		userId: number,
		xp = 10001200,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.XP]: xp },
			`${UsersColumns.Id} = ${userId}`,
			hasLogMessage,
		);
		return result;
	}

	public async updateUserPhoneNumberByUserEmail(
		userEmail: string,
		phoneNumber = getRandomPhone(),
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.PHONE_NUMBER]: phoneNumber },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
		);
		return result;
	}

	public async updateCampaignExpirationDateByName(
		campaignName: string,
		newExpirationDate: string = formatDate(-1),
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Campaigns,
			{ [CampaignsColumns.ExpirationDate]: newExpirationDate },
			`${CampaignsColumns.Name} = '${campaignName}'`,
		);
		return result;
	}

	public async insertWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
	): Promise<QueryResultRow> {
		const result = await this.insert(DbTables.Settings, {
			key: key,
			value: JSON.stringify(value),
		});
		return result;
	}

	public async updateWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Settings,
			{ value: JSON.stringify(value) },
			`${SettingsColumns.Key} = '${key}'`,
		);
		return result;
	}

	public async getWithdrawLimitFromSettingByKey(
		key: WithdrawLimitsSettingsValues,
	): Promise<QueryResultRow[]> {
		const result = await this.query(
			DbTables.Settings,
			[`${SettingsColumns.Key}`, `${SettingsColumns.Value}`],
			`${SettingsColumns.Key} = '${key}'`,
		);
		return result;
	}

	public async createNewUser({
		username,
		email,
		password,
		image = DEFAULT_IMAGE,
		amount = 10000000,
		startingXp = 10001200,
		emailVerified = false,
		unit = Unit.COINS,
		hasLogMessage = true,
		tags,
		userClass,
	}: NewUserOptions): Promise<number> {
		if (!username || !email || !password) {
			throw new Error(
				"Missing required fields: username, email, or password",
			);
		}

		const passwordHash = await convertToScryptHash(password);

		await this.insert(
			DbTables.Users,
			{
				[UsersColumns.Username]: username,
				[UsersColumns.Email]: email.toLowerCase(),
				[UsersColumns.Image]: image,
				[UsersColumns.PasswordHash]: passwordHash,
				[UsersColumns.EmailVerified]: emailVerified,
				[UsersColumns.Tags]: formatUserTags(tags),
				[UsersColumns.UserClass]: userClass ?? UserClasses.User,
			},
			hasLogMessage,
		);

		const userInfo = await this.getUserInfoByUsername(username, false);
		const userId = userInfo[0][UsersColumns.Id] as number;

		await this.insertUserWallet(userId, unit, amount, false);
		await this.updateUserXP(userId, startingXp, false);

		return userId;
	}
}
