import { DEFAULT_IMAGE } from "@constants/defaults";
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
	generateCustomUrl,
	generateRandomString,
	getISODate,
	getRandomNumber,
	getRandomPhone,
} from "@core/utils/utils";
import { AmlInfoColumns } from "@enums/db/aml-info-columns";
import { AmlStatusColumns } from "@enums/db/aml-status-columns";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";
import { AmlVerificationStatus } from "@enums/db/aml-verification-status";
import { CampaignsColumns } from "@enums/db/campaigns-columns";
import { DbTables } from "@enums/db/db-tables";
import { KothEventColumns } from "@enums/db/koth-event-columns";
import { KothEventName, KothEventType } from "@enums/db/koth-event-types";
import { PromotionColumns } from "@enums/db/promotion-columns";
import { SettingsColumns } from "@enums/db/settings-columns";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { UsersColumns } from "@enums/db/users-columns";
import { WalletsColumns } from "@enums/db/wallets-columns";
import { WithdrawLimitsSettingsValues } from "@enums/db/withdraw-settings-values";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { Unit } from "@enums/units";
import { QueryResultRow } from "pg";
import { BaseDB } from "./base-db";
import {
	createCasinoPromotionWithUserId,
	createDefaultPromotionWithUserId,
	createLiveCasinoPromotionWithUserId,
	createSportsbookPromotionWithUserId,
	createVipPromotionWithUserId,
} from "./constants/promotion-defaults";
import { AmlInfoOptions } from "./interfaces/aml-info-options";
import { AmlStatusInsertOptions } from "./interfaces/aml-status-insert-options";
import { PromotionInsertOptions } from "./interfaces/promotion-insert-options";
import { NewUserOptions } from "./interfaces/storage-state-new-user-options";

export class GamdomDb extends BaseDB {
	constructor() {
		super();
	}

	public async getUserInfoById(userId: number): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Id} = $1`,
			[userId],
			true,
		);
	}

	public async getUserInfoByUsername(
		username: string,
		hasLogMessage = true,
	): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Users,
			"*",
			`${UsersColumns.Username} = $1`,
			[username],
			hasLogMessage,
		);
	}

	public async makeUserSuperAdmin(userId: number): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{
				[UsersColumns.Tags]: UserTags.SuperAdmin,
				[UsersColumns.UserClass]: UserClasses.Admin,
			},
			`${UsersColumns.Id} = ${userId}`,
			true,
		);
	}

	public async updateUserTotalDepositedAmountByUserEmail(
		userEmail: string,
		amount = 300,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
			true,
		);
	}

	public async updateUserTotalDepositedAmountByUserId(
		userId: number,
		amount = 300,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.TotalDeposited]: amount },
			`${UsersColumns.Id} = ${userId}`,
			true,
		);
	}

	public async updateUserWalletAmounts(
		userId: number,
		unit: Unit,
		amount: number,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Wallets,
			{ [WalletsColumns.Balance]: amount },
			`${WalletsColumns.UserId} = ${userId} AND ${WalletsColumns.Unit} = '${unit}'`,
			true,
		);
	}

	public async upsertUserWallet(
		userId: number,
		unit: Unit,
		amount: number,
	): Promise<QueryResultRow[]> {
		const result = await this.query(
			DbTables.Wallets,
			"*",
			`${WalletsColumns.UserId} = $1 AND ${WalletsColumns.Unit} = $2`,
			[userId, unit],
			false,
		);

		if (result.length > 0) {
			const updated = await this.updateUserWalletAmounts(
				userId,
				unit,
				amount,
			);
			return [updated];
		}

		const inserted = await this.insertUserWallet(userId, unit, amount);
		return [inserted];
	}

	public async updateUserEmailVerification(
		userId: number,
		isVerified = true,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.EmailVerified]: isVerified },
			`${UsersColumns.Id} = ${userId}`,
			true,
		);
	}

	public async insertUserWallet(
		userId: number,
		unit: WalletUnit = Unit.COINS,
		balance = 10000000,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		return this.insert(
			DbTables.Wallets,
			{
				[WalletsColumns.UserId]: userId,
				[WalletsColumns.Unit]: unit,
				[WalletsColumns.Balance]: balance,
			},
			hasLogMessage,
		);
	}

	public async updateUserXP(
		userId: number,
		xp = 10001200,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.XP]: xp },
			`${UsersColumns.Id} = ${userId}`,
			hasLogMessage,
		);
	}

	public async updateUserPhoneNumberByUserEmail(
		userEmail: string,
		phoneNumber = getRandomPhone(),
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Users,
			{ [UsersColumns.PHONE_NUMBER]: phoneNumber },
			`${UsersColumns.Email} = '${userEmail.toLowerCase()}'`,
			true,
		);
	}

	public async updateCampaignExpirationDateByName(
		campaignName: string,
		newExpirationDate: string = formatDate(-1),
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Campaigns,
			{ [CampaignsColumns.ExpirationDate]: newExpirationDate },
			`${CampaignsColumns.Name} = '${campaignName}'`,
			true,
		);
	}

	public async insertWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
	): Promise<QueryResultRow> {
		return this.insert(
			DbTables.Settings,
			{
				key: key,
				value: JSON.stringify(value),
			},
			true,
		);
	}

	public async updateWithdrawLimitInSetting(
		key: WithdrawLimitsSettingsValues,
		value: number,
	): Promise<QueryResultRow> {
		return this.update(
			DbTables.Settings,
			{ value: JSON.stringify(value) },
			`${SettingsColumns.Key} = '${key}'`,
			true,
		);
	}

	public async getWithdrawLimitFromSettingByKey(
		key: WithdrawLimitsSettingsValues,
	): Promise<QueryResultRow[]> {
		return this.query(
			DbTables.Settings,
			[SettingsColumns.Key, SettingsColumns.Value],
			`${SettingsColumns.Key} = '${key}'`,
			[],
			true,
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
		);
		return result;
	}

	public async insertDefaultAmlInfo(
		userId: number,
		hasLogMessage = false,
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
		);
	}

	public async insertAmlInfoFromOptions(
		options: AmlInfoOptions,
		hasLogMessage = false,
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

		return this.insert(DbTables.AmlStatus, data, hasLogMessage);
	}

	public async insertAmlStatusFromOptions(
		options: AmlStatusInsertOptions,
		hasLogMessage = false,
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
	): Promise<QueryResultRow> {
		const now = getISODate();
		const futureDateStr = getISODate({ yearsOffset: 1 });
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

		return this.insertAmlStatusFromOptions(options, hasLogMessage);
	}

	public async insertDefaultLevel1AmlStatus(
		userId: number,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level1,
			hasLogMessage,
		);
	}

	public async insertDefaultLevel2AmlStatus(
		userId: number,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level2,
			hasLogMessage,
		);
	}

	public async insertDefaultLevel3AmlStatus(
		userId: number,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		return this.insertDefaultAmlStatusByLevel(
			userId,
			AmlVerificationLevel.Level3,
			hasLogMessage,
		);
	}

	public async insertAmlStatusWithCustomStatus(
		userId: number,
		level1Status: AmlVerificationStatus | null = null,
		level2Status: AmlVerificationStatus | null = null,
		level3Status: AmlVerificationStatus | null = null,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const now = getISODate();
		const futureDateStr = getISODate({ yearsOffset: 1 });
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

		return this.insertAmlStatusFromOptions(options, hasLogMessage);
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

		return this.withClient(async () => {
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
			);

			const userInfo = await this.getUserInfoByUsername(username, false);
			const userId = userInfo[0][UsersColumns.Id] as number;

			await this.insertUserWallet(userId, unit, amount, false);
			await this.updateUserXP(userId, startingXp, false);

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
		const startDate = new Date(getISODate({ daysOffset: -1 }));
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

	public async insertPromotion(
		title: string,
		subtitle: NullableString = null,
		description: NullableString = null,
		termsAndConditions: NullableString = null,
		imageCover: NullableString = null,
		imageThumbnail: NullableString = null,
		howToParticipate: NullableString = null,
		rewardsInfo: NullableString = null,
		priority = 1,
		isVisible: BooleanValueString = BooleanValueString.TRUE,
		buttonLink: NullableString = null,
		buttonText: NullableString = null,
		customUrl: NullableString = null,
		category: NullableString = null,
		subCategory: NullableString = null,
		userId: number,
		startDate: NullableDateString = null,
		expirationDate: NullableDateString = null,
		created: NullableDateString = null,
		modifiedDate: NullableDateString = null,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const now = getISODate();
		const defaultStartDate = getISODate({ daysOffset: -3 });

		const generatedCustomUrl = customUrl || generateCustomUrl(title);
		const finalCreatedByAdminId = userId;
		const finalUpdatedByAdminId = userId;

		const baseData = {
			[PromotionColumns.Title]: title,
			[PromotionColumns.Subtitle]: subtitle,
			[PromotionColumns.Description]: description,
			[PromotionColumns.TermsAndConditions]: termsAndConditions,
			[PromotionColumns.ImageCover]: imageCover,
			[PromotionColumns.ImageThumbnail]: imageThumbnail,
			[PromotionColumns.HowToParticipate]: howToParticipate,
			[PromotionColumns.RewardsInfo]: rewardsInfo,
			[PromotionColumns.Priority]: priority,
			[PromotionColumns.IsVisible]: isVisible === BooleanValueString.TRUE,
			[PromotionColumns.ButtonLink]: buttonLink,
			[PromotionColumns.ButtonText]: buttonText,
			[PromotionColumns.CustomUrl]: generatedCustomUrl,
			[PromotionColumns.Category]: category,
			[PromotionColumns.SubCategory]: subCategory,
			[PromotionColumns.CreatedByAdminId]: finalCreatedByAdminId,
			[PromotionColumns.UpdatedByAdminId]: finalUpdatedByAdminId,
			[PromotionColumns.StartDate]: startDate || defaultStartDate,
			[PromotionColumns.ExpirationDate]: expirationDate,
			[PromotionColumns.Created]: created || now,
			[PromotionColumns.ModifiedDate]: modifiedDate || now,
		};

		const data = Object.fromEntries(
			Object.entries(baseData).filter(([, value]) => value !== null),
		);

		return this.insert(DbTables.Promotions, data, hasLogMessage);
	}

	public async insertDefaultPromotion(
		title: string,
		userId: number,
		startDate?: NullableDateString,
		expirationDate?: NullableDateString,
		buttonText?: NullableString,
		customUrl?: NullableString,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const defaults = createDefaultPromotionWithUserId(userId);

		return this.insertPromotionFromOptions(
			{
				...defaults,
				title,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			},
			userId,
			hasLogMessage,
		);
	}

	public async insertPromotionFromOptions(
		options: PromotionInsertOptions,
		userId: number,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		return this.insertPromotion(
			options.title,
			options.subtitle || null,
			options.description || null,
			options.termsAndConditions || null,
			options.imageCover || null,
			options.imageThumbnail || null,
			options.howToParticipate || null,
			options.rewardsInfo || null,
			options.priority || 1,
			options.isVisible || BooleanValueString.TRUE,
			options.buttonLink || null,
			options.buttonText || null,
			options.customUrl || null,
			options.category || null,
			options.subCategory || null,
			userId,
			options.startDate || null,
			options.expirationDate || null,
			options.created || null,
			options.modifiedDate || null,
			hasLogMessage,
		);
	}

	public async insertCasinoPromotion(
		title: string,
		userId: number,
		startDate?: NullableDateString,
		expirationDate?: NullableDateString,
		buttonText?: NullableString,
		customUrl?: NullableString,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const defaults = createCasinoPromotionWithUserId(userId);

		return this.insertPromotionFromOptions(
			{
				...defaults,
				title,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			},
			userId,
			hasLogMessage,
		);
	}

	public async insertSportsbookPromotion(
		title: string,
		userId: number,
		startDate?: NullableDateString,
		expirationDate?: NullableDateString,
		buttonText?: NullableString,
		customUrl?: NullableString,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const defaults = createSportsbookPromotionWithUserId(userId);

		return this.insertPromotionFromOptions(
			{
				...defaults,
				title,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			},
			userId,
			hasLogMessage,
		);
	}

	public async insertLiveCasinoPromotion(
		title: string,
		userId: number,
		startDate?: NullableDateString,
		expirationDate?: NullableDateString,
		buttonText?: NullableString,
		customUrl?: NullableString,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const defaults = createLiveCasinoPromotionWithUserId(userId);

		return this.insertPromotionFromOptions(
			{
				...defaults,
				title,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			},
			userId,
			hasLogMessage,
		);
	}

	public async insertVipPromotion(
		title: string,
		userId: number,
		startDate?: NullableDateString,
		expirationDate?: NullableDateString,
		buttonText?: NullableString,
		customUrl?: NullableString,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const defaults = createVipPromotionWithUserId(userId);

		return this.insertPromotionFromOptions(
			{
				...defaults,
				title,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			},
			userId,
			hasLogMessage,
		);
	}

	public async deletePromotionByTitle(
		title: string,
		hasLogMessage = false,
	): Promise<void> {
		return this.delete(
			DbTables.Promotions,
			`${PromotionColumns.Title} = '${title}'`,
			hasLogMessage,
		);
	}

	public async expirePromotionByTitle(
		title: string,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const expirationDate = getISODate({ daysOffset: -1 });
		const now = getISODate();

		const updateData = {
			[PromotionColumns.ExpirationDate]: expirationDate,
			[PromotionColumns.ModifiedDate]: now,
		};

		return this.update(
			DbTables.Promotions,
			updateData,
			`${PromotionColumns.Title} = '${title}'`,
			hasLogMessage,
		);
	}

	public async activatePromotionByTitle(
		title: string,
		hasLogMessage = false,
	): Promise<QueryResultRow> {
		const startDate = getISODate({ daysOffset: -2 });
		const now = getISODate();

		const updateData = {
			[PromotionColumns.StartDate]: startDate,
			[PromotionColumns.ModifiedDate]: now,
		};

		return this.update(
			DbTables.Promotions,
			updateData,
			`${PromotionColumns.Title} = '${title}'`,
			hasLogMessage,
		);
	}
}
