import { DEFAULT_IMAGE } from "@constants/defaults";
import { AmlInfoOptions } from "@core/api/interfaces/aml-info-options";
import { AmlStatusInsertOptions } from "@core/api/interfaces/aml-status-insert-options";
import { NewUserOptions } from "@core/api/interfaces/storage-state-new-user-options";
import { generateAmlVerificationStatusReasonText } from "@core/helpers/asserter-helpers/text-asserters";
import {
	NullableDateString,
	NullableString,
	WalletUnit,
} from "@core/types/types";
import {
	convertToScryptHash,
	formatDate,
	formatUserTags,
	generateRandomString,
	getRandomNumber,
	getRandomPhone,
} from "@core/utils/utils";
import { AmlInfoColumns } from "@enums/db/aml-info-columns";
import { AmlStatusColumns } from "@enums/db/aml-status-columns";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { AmlVerificationStatus } from "@enums/db/aml-verification-status";
import { CampaignsColumns } from "@enums/db/campaigns-columns";
import { DbTables } from "@enums/db/db-tables";
import { SettingsColumns } from "@enums/db/settings-columns";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { UsersColumns } from "@enums/db/users-columns";
import { WalletsColumns } from "@enums/db/wallets-columns";
import { WithdrawLimitsSettingsValues } from "@enums/db/withdraw-settings-values";
import { Unit } from "@enums/units";
import * as Configuration from "configuration";
import { Pool, PoolClient, QueryResultRow } from "pg";
import { BaseDB } from "./base-db";
import { KothEventName, KothEventType } from "@enums/db/koth-event-types";
import { KothEventColumns } from "@enums/db/koth-event-columns";

export class GamdomDb extends BaseDB {
	constructor() {
		super();
		this.pool = new Pool(Configuration.poolConfig);
	}

	public async getUserInfoById(
		userId: number,
		client?: PoolClient,
	): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Id} = $1`,
			[userId],
			true,
			client,
		);
	}

	public async getUserInfoByUsername(
		username: string,
		hasLogMessage = true,
		client?: PoolClient,
	): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Username} = $1`,
			[username],
			hasLogMessage,
			client,
		);
	}

	public async makeUserSuperAdmin(
		userId: number,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{
				[UsersColumns.Tags]: UserTags.SuperAdmin,
				[UsersColumns.UserClass]: UserClasses.Admin,
			},
			`${UsersColumns.Id} = ${userId}`,
			true,
			client,
		);
	}

	public async updateUserTotalDepositedAmountByUserEmail(
		userEmail: string,
		amount = 300,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
			true,
			client,
		);
	}

	public async updateUserTotalDepositedAmountByUserId(
		userId: number,
		amount = 300,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Id} = ${userId}`,
			true,
			client,
		);
	}

	public async updateUserEmailVerification(
		userId: number,
		isVerified = true,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.EmailVerified]: isVerified },
			`${UsersColumns.Id} = ${userId}`,
			true,
			client,
		);
	}

	public async insertUserWallet(
		userId: number,
		unit: WalletUnit = Unit.COINS,
		balance = 10000000,
		hasLogMessage = true,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insert(
			DbTables.Wallets,
			{
				[WalletsColumns.UserId]: userId,
				[WalletsColumns.Unit]: unit,
				[WalletsColumns.Balance]: balance,
			},
			hasLogMessage,
			client,
		);
	}

	public async updateUserXP(
		userId: number,
		xp = 10001200,
		hasLogMessage = true,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.XP]: xp },
			`${UsersColumns.Id} = ${userId}`,
			hasLogMessage,
			client,
		);
	}

	public async updateUserPhoneNumberByUserEmail(
		userEmail: string,
		phoneNumber = getRandomPhone(),
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.PHONE_NUMBER]: phoneNumber },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
			true,
			client,
		);
	}

	public async updateCampaignExpirationDateByName(
		campaignName: string,
		newExpirationDate: string = formatDate(-1),
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Campaigns,
			{ [CampaignsColumns.ExpirationDate]: newExpirationDate },
			`${CampaignsColumns.Name} = '${campaignName}'`,
			true,
			client,
		);
	}

	public async insertWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insert(
			DbTables.Settings,
			{
				key: key,
				value: JSON.stringify(value),
			},
			true,
			client,
		);
	}

	public async updateWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Settings,
			{ value: JSON.stringify(value) },
			`${SettingsColumns.Key} = '${key}'`,
			true,
			client,
		);
	}

	public async getWithdrawLimitFromSettingByKey(
		key: WithdrawLimitsSettingsValues,
		client?: PoolClient,
	): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Settings,
			[SettingsColumns.Key, SettingsColumns.Value],
			`${SettingsColumns.Key} = '${key}'`,
			[],
			true,
			client,
		);
	}

	public async insertAmlInfo(
		firstName: string,
		lastName: string,
		dobDay: number,
		dobMonth: number,
		dobYear: number,
		address: string,
		address2: string | null = null,
		zipCode: string,
		city: string,
		state: string | null = null,
		country: string,
		userId: number,
		idCountry: string,
		idType: string,
		title: string,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		const result = await this.insert(
			DbTables.AmlInfo,
			{
				[AmlInfoColumns.FirstName]: firstName,
				[AmlInfoColumns.LastName]: lastName,
				[AmlInfoColumns.DobDay]: dobDay,
				[AmlInfoColumns.DobMonth]: dobMonth,
				[AmlInfoColumns.DobYear]: dobYear,
				[AmlInfoColumns.Address]: address,
				...(address2 && { [AmlInfoColumns.Address2]: address2 }),
				[AmlInfoColumns.ZipCode]: zipCode,
				[AmlInfoColumns.City]: city,
				...(state && { [AmlInfoColumns.State]: state }),
				[AmlInfoColumns.Country]: country,
				[AmlInfoColumns.UserId]: userId,
				[AmlInfoColumns.IdCountry]: idCountry,
				[AmlInfoColumns.IdType]: idType,
				[AmlInfoColumns.Title]: title,
			},
			hasLogMessage,
			client,
		);
		return result;
	}

	public async insertDefaultAmlInfo(
		userId: number,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertAmlInfo(
			generateRandomString({ length: 8 }),
			generateRandomString({ length: 9 }),
			15,
			6,
			1990,
			"123 Main St",
			"Apt 4B",
			"90210",
			"Los Angeles",
			"California",
			"Bulgaria",
			userId,
			"Bulgaria",
			"ID",
			"MR",
			hasLogMessage,
			client,
		);
	}

	public async insertAmlInfoFromOptions(
		options: AmlInfoOptions,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertAmlInfo(
			options.firstName,
			options.lastName,
			options.dobDay,
			options.dobMonth,
			options.dobYear,
			options.address,
			options.address2 || null,
			options.zipCode,
			options.city,
			options.state || null,
			options.country,
			options.userId,
			options.idCountry,
			options.idType,
			options.title,
			hasLogMessage,
			client,
		);
	}

	public async insertAmlStatus(
		userId: number,
		lvl1Reason: NullableString = null,
		lvl2Reason: NullableString = null,
		lvl3Reason: NullableString = null,
		lvl1Status: NullableString = null,
		lvl2Status: NullableString = null,
		lvl3Status: NullableString = null,
		lvl1Date: NullableDateString = null,
		lvl2Date: NullableDateString = null,
		lvl3Date: NullableDateString = null,
		lvl1ActionDate: NullableDateString = null,
		lvl2ActionDate: NullableDateString = null,
		lvl3ActionDate: NullableDateString = null,
		sixDigits: NullableString = null,
		sixDigitsCreationDate: NullableDateString = null,
		modifiedDate: NullableDateString = null,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		const baseData = {
			[AmlStatusColumns.UserId]: userId,
			[AmlStatusColumns.Lvl1Reason]: lvl1Reason,
			[AmlStatusColumns.Lvl2Reason]: lvl2Reason,
			[AmlStatusColumns.Lvl3Reason]: lvl3Reason,
			[AmlStatusColumns.Lvl1Status]: lvl1Status,
			[AmlStatusColumns.Lvl2Status]: lvl2Status,
			[AmlStatusColumns.Lvl3Status]: lvl3Status,
			[AmlStatusColumns.Lvl1Date]: lvl1Date,
			[AmlStatusColumns.Lvl2Date]: lvl2Date,
			[AmlStatusColumns.Lvl3Date]: lvl3Date,
			[AmlStatusColumns.Lvl1ActionDate]: lvl1ActionDate,
			[AmlStatusColumns.Lvl2ActionDate]: lvl2ActionDate,
			[AmlStatusColumns.Lvl3ActionDate]: lvl3ActionDate,
			[AmlStatusColumns.SixDigits]: sixDigits,
			[AmlStatusColumns.SixDigitsCreationDate]: sixDigitsCreationDate,
			[AmlStatusColumns.ModifiedDate]: modifiedDate,
		};

		const data = Object.fromEntries(
			Object.entries(baseData).filter(([, value]) => value !== null),
		);

		return this.insert(DbTables.AmlStatus, data, hasLogMessage, client);
	}

	public async insertAmlStatusFromOptions(
		options: AmlStatusInsertOptions,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertAmlStatus(
			options.userId,
			options.lvl1Reason || null,
			options.lvl2Reason || null,
			options.lvl3Reason || null,
			options.lvl1Status || null,
			options.lvl2Status || null,
			options.lvl3Status || null,
			options.lvl1Date || null,
			options.lvl2Date || null,
			options.lvl3Date || null,
			options.lvl1ActionDate || null,
			options.lvl2ActionDate || null,
			options.lvl3ActionDate || null,
			options.sixDigits || null,
			options.sixDigitsCreationDate || null,
			options.modifiedDate || null,
			hasLogMessage,
			client,
		);
	}

	private setAmlStatusPropertiesForLevel(
		options: AmlStatusInsertOptions,
		level: AmlVerificationLevel,
		status: AmlVerificationStatus | null,
		futureDateStr: string,
	): void {
		if (status === null) return;

		if (level === AmlVerificationLevel.Level1) {
			options.lvl1Reason = generateAmlVerificationStatusReasonText(
				level,
				status,
			);
			options.lvl1Status = status;
			options.lvl1Date = futureDateStr;
			options.lvl1ActionDate = futureDateStr;
		} else if (level === AmlVerificationLevel.Level2) {
			options.lvl2Reason = generateAmlVerificationStatusReasonText(
				level,
				status,
			);
			options.lvl2Status = status;
			options.lvl2Date = futureDateStr;
			options.lvl2ActionDate = futureDateStr;
		} else if (level === AmlVerificationLevel.Level3) {
			options.lvl3Reason = generateAmlVerificationStatusReasonText(
				level,
				status,
			);
			options.lvl3Status = status;
			options.lvl3Date = futureDateStr;
			options.lvl3ActionDate = futureDateStr;
		}
	}

	public async insertDefaultAmlStatusByLevel(
		userId: number,
		level: AmlVerificationLevel,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		const now = new Date().toISOString();
		const futureDate = new Date();
		futureDate.setFullYear(futureDate.getFullYear() + 1);
		const futureDateStr = futureDate.toISOString();
		const sixDigits = getRandomNumber(6).toString();

		const options: AmlStatusInsertOptions = {
			userId: userId,
			sixDigits: sixDigits,
			sixDigitsCreationDate: futureDateStr,
			modifiedDate: now,
			hasLogMessage: hasLogMessage,
		};

		if (level >= AmlVerificationLevel.Level2) {
			this.setAmlStatusPropertiesForLevel(
				options,
				AmlVerificationLevel.Level1,
				AmlVerificationStatus.VERIFIED,
				futureDateStr,
			);
		}

		if (level >= AmlVerificationLevel.Level3) {
			this.setAmlStatusPropertiesForLevel(
				options,
				AmlVerificationLevel.Level2,
				AmlVerificationStatus.VERIFIED,
				futureDateStr,
			);
		}

		if (level >= AmlVerificationLevel.LevelMax) {
			this.setAmlStatusPropertiesForLevel(
				options,
				AmlVerificationLevel.Level3,
				AmlVerificationStatus.VERIFIED,
				futureDateStr,
			);
		}

		return this.insertAmlStatusFromOptions(options, hasLogMessage, client);
	}

	public async insertDefaultLevel1AmlStatus(
		userId: number,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level1,
			hasLogMessage,
			client,
		);
	}

	public async insertDefaultLevel2AmlStatus(
		userId: number,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level2,
			hasLogMessage,
			client,
		);
	}

	public async insertDefaultLevel3AmlStatus(
		userId: number,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level3,
			hasLogMessage,
			client,
		);
	}

	public async insertAmlStatusWithCustomStatus(
		userId: number,
		level1Status: AmlVerificationStatus | null = null,
		level2Status: AmlVerificationStatus | null = null,
		level3Status: AmlVerificationStatus | null = null,
		hasLogMessage = false,
		client?: PoolClient,
	): Promise<QueryResultRow> {
		const now = new Date().toISOString();
		const futureDate = new Date();
		futureDate.setFullYear(futureDate.getFullYear() + 1);
		const futureDateStr = futureDate.toISOString();
		const sixDigits = getRandomNumber(6).toString();

		const options: AmlStatusInsertOptions = {
			userId: userId,
			sixDigits: sixDigits,
			sixDigitsCreationDate: futureDateStr,
			modifiedDate: now,
			hasLogMessage: hasLogMessage,
		};

		this.setAmlStatusPropertiesForLevel(
			options,
			AmlVerificationLevel.Level1,
			level1Status,
			futureDateStr,
		);
		this.setAmlStatusPropertiesForLevel(
			options,
			AmlVerificationLevel.Level2,
			level2Status,
			futureDateStr,
		);
		this.setAmlStatusPropertiesForLevel(
			options,
			AmlVerificationLevel.Level3,
			level3Status,
			futureDateStr,
		);

		return this.insertAmlStatusFromOptions(options, hasLogMessage, client);
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
		totalDeposited = 300,
		hasLogMessage = false,
		tags,
		userClass,
	}: NewUserOptions): Promise<number> {
		if (!username || !email || !password) {
			throw new Error(
				"Missing required fields: username, email, or password",
			);
		}

		const passwordHash = await convertToScryptHash(password);

		return this.withClient(async (client) => {
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
					[UsersColumns.TotalDeposited]: totalDeposited,
				},
				hasLogMessage,
				client,
			);

			const userInfo = await this.getUserInfoByUsername(
				username,
				false,
				client,
			);
			const userId = userInfo[0][UsersColumns.Id] as number;

			await this.insertUserWallet(userId, unit, amount, false, client);
			await this.updateUserXP(userId, startingXp, false, client);

			return userId;
		});
	}

	private async createKothEvent(
		eventName: KothEventName,
		hasLogMessage = true,
		durationDays = 13, // Two weeks duration
		maxWinners = 50,
		prizeCoins = 3000000,
	): Promise<QueryResultRow> {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - 1); // 1 day before current day

		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + durationDays);

		return this.insertKothEvent(
			eventName,
			KothEventType.SCHEDULED,
			maxWinners,
			prizeCoins,
			startDate.toISOString(),
			endDate.toISOString(),
			hasLogMessage,
		);
	}

	public async insertMonthlyKothEvent(
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		return this.createKothEvent(KothEventName.MONTHLY, hasLogMessage);
	}

	public async insertWeeklyKothEvent(
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		return this.createKothEvent(KothEventName.WEEKLY, hasLogMessage);
	}

	public async insertDailyKothEvent(
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		return this.createKothEvent(KothEventName.DAILY, hasLogMessage);
	}

	public async insertKothEvent(
		eventName: string,
		eventType: KothEventType,
		maxWinners: number,
		prizeCoins: number,
		startDate: string,
		endDate: string,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const result = await this.insert(
			DbTables.KothEvents,
			{
				[KothEventColumns.EventName]: eventName,
				[KothEventColumns.EventType]: eventType,
				[KothEventColumns.MaxWinners]: maxWinners,
				[KothEventColumns.PrizeCoins]: prizeCoins,
				[KothEventColumns.StartDate]: startDate,
				[KothEventColumns.EndDate]: endDate,
				[KothEventColumns.Ended]: false,
			},
			hasLogMessage,
		);
		return result;
	}

	public async kothEventExists(
		eventName: KothEventName | string,
		hasLogMessage = true,
	): Promise<boolean> {
		const result = await this.query(
			DbTables.KothEvents,
			["COUNT(*) as count"],
			`${KothEventColumns.EventName} = $1 AND ${KothEventColumns.Ended} = false`,
			[eventName],
			hasLogMessage,
		);

		return parseInt(result[0].count as string, 10) > 0;
	}

	public async dailyKothEventExists(hasLogMessage = true): Promise<boolean> {
		return this.kothEventExists(KothEventName.DAILY, hasLogMessage);
	}

	public async weeklyKothEventExists(hasLogMessage = true): Promise<boolean> {
		return this.kothEventExists(KothEventName.WEEKLY, hasLogMessage);
	}

	public async monthlyKothEventExists(
		hasLogMessage = true,
	): Promise<boolean> {
		return this.kothEventExists(KothEventName.MONTHLY, hasLogMessage);
	}
}
