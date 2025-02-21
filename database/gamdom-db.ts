import * as Configuration from "configuration";
import { Pool, QueryResultRow } from "pg";
import { BaseDB } from "./base-db";
import { DbTables } from "@enums/db/db-tables";
import { UsersColumns } from "@enums/db/users-columns";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { Unit } from "@enums/units";
import { WalletsColumns } from "@enums/db/wallets-columns";
import { getRandomPhone } from "@core/utils/utils";

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
	): Promise<QueryResultRow[]> {
		const userInfo = await this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Username} = $1`,
			[username],
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
		unit = Unit.COINS,
		balance = 10000000,
	): Promise<QueryResultRow> {
		const result = await this.insert(DbTables.Wallets, {
			[WalletsColumns.UserId]: userId,
			[WalletsColumns.Unit]: unit,
			[WalletsColumns.Balance]: balance,
		});
		return result;
	}

	public async updateUserXP(
		userId: number,
		xp = 10001200,
	): Promise<QueryResultRow> {
		const result = await this.update(
			DbTables.Users,
			{ [UsersColumns.XP]: xp },
			`${UsersColumns.Id} = ${userId}`,
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
}
