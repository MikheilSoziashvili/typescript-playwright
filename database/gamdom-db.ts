import * as Configuration from "configuration";
import { Pool, QueryResultRow } from "pg";
import { BaseDB } from "./base-db";
import { DbTables } from "@enums/db/db-tables";
import { UsersColumns } from "@enums/db/users-columns";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";

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
			`${UsersColumns.Email} = '${userEmail}'`,
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
}
