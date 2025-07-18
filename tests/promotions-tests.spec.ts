import { DATASETS_DIR } from "@constants/file-paths";
import {
	generateCustomUrl,
	generateRandomString,
	getISODate,
	parse_csv,
} from "@core/utils/utils";
import { PromotionTestData, RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionIsVipCategories } from "@enums/promotion-is-vip-categories";
import { PromotionStatuses } from "@enums/promotion-statuses";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";
import { PromotionType } from "@enums/promotion-types";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { PromotionsPage } from "@pages/promotions/promotions-page";
import { isCI } from "configuration";
import { GamdomDb } from "database/gamdom-db";

type PromotionInsertMethod = (
	gamdomDb: GamdomDb,
	name: string,
	userId: number,
	startDate?: string,
	expirationDate?: string,
) => Promise<unknown>;

const promotionTestData = {
	[PromotionType.DEFAULT]: {
		name: PromotionType.DEFAULT,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertDefaultPromotion(
				name,
				userId,
				startDate,
				expirationDate,
			),
	},
	[PromotionType.CASINO]: {
		name: PromotionType.CASINO,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertCasinoPromotion(
				name,
				userId,
				startDate,
				expirationDate,
			),
	},
	[PromotionType.VIP]: {
		name: PromotionType.VIP,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertVipPromotion(
				name,
				userId,
				startDate,
				expirationDate,
			),
	},
	[PromotionType.SPORTSBOOK]: {
		name: PromotionType.SPORTSBOOK,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertSportsbookPromotion(
				name,
				userId,
				startDate,
				expirationDate,
			),
	},
	[PromotionType.LIVE_CASINO]: {
		name: PromotionType.LIVE_CASINO,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertLiveCasinoPromotion(
				name,
				userId,
				startDate,
				expirationDate,
			),
	},
};

const promotionTypes = Object.values(promotionTestData);

const testScenarios = {
	expiration: {
		testId: "ENG-5515",
		description:
			"Promotion automatically go Expired when expiration_date expire",
		createPromotion: (
			insertMethod: PromotionInsertMethod,
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
		) => insertMethod(gamdomDb, name, userId),
		action: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.expirePromotionByTitle(name),
		initialStatus: PromotionStatuses.ACTIVE,
		finalStatus: PromotionStatuses.EXPIRED,
		initialVisibilityAssertion: (
			promotionsPage: PromotionsPage,
			name: string,
		) =>
			promotionsPage
				.assertThat()
				.promotionIsDisplayedInPromotionsPage(name),
		finalVisibilityAssertion: (
			promotionsPage: PromotionsPage,
			name: string,
		) =>
			promotionsPage
				.assertThat()
				.promotionIsNotDisplayedInPromotionsPage(name),
	},
	activation: {
		testId: "ENG-5512",
		description:
			"Promotion automatically go Active when start_date is in the past",
		createPromotion: (
			insertMethod: PromotionInsertMethod,
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
		) =>
			insertMethod(
				gamdomDb,
				name,
				userId,
				getISODate({ daysOffset: +1 }),
			),
		action: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.activatePromotionByTitle(name),
		initialStatus: PromotionStatuses.SOON,
		finalStatus: PromotionStatuses.ACTIVE,
		initialVisibilityAssertion: (
			promotionsPage: PromotionsPage,
			name: string,
		) =>
			promotionsPage
				.assertThat()
				.promotionIsNotDisplayedInPromotionsPage(name),
		finalVisibilityAssertion: (
			promotionsPage: PromotionsPage,
			name: string,
		) =>
			promotionsPage
				.assertThat()
				.promotionIsDisplayedInPromotionsPage(name),
	},
};

const promotionCombinations = parse_csv(
	DATASETS_DIR,
	CsvFilesName.PROMOTION_COMBINATIONS,
) as {
	category: keyof typeof PromotionCategories;
	subCategory: keyof typeof PromotionSubStatuses;
	isForVip: keyof typeof PromotionIsVipCategories;
}[];

test.describe("Promotion tests", () => {
	let promotionName: string;
	let userId: number;

	test.use(
		storageStateNewUserDB({
			tags: UserTags.PromotionAdmin,
			userClass: UserClasses.Admin,
			emailVerified: true,
			isEmailWithGamdomDomain: true,
		}),
	);

	test.beforeEach(async ({ gamdomApi, gamdomDb }) => {
		const promotionAdminUserData = new RegisterTestData({
			useGamdomEmailDomain: true,
		});
		await gamdomDb.createNewUser({
			username: promotionAdminUserData.username,
			password: promotionAdminUserData.password,
			email: promotionAdminUserData.email,
			tags: UserTags.SuperAdmin,
			userClass: UserClasses.Admin,
			emailVerified: true,
		});

		userId = (
			await gamdomApi.getBasicInfo(
				promotionAdminUserData.username,
				promotionAdminUserData.password,
			)
		).user.id;
	});

	test.afterEach(async ({ gamdomDb }) => {
		await gamdomDb.deletePromotionByTitle(promotionName);
	});

	test.describe("Promotion expiration tests", () => {
		promotionTypes.forEach((promotionType) => {
			Object.values(testScenarios).forEach((scenario) => {
				test(`[${scenario.testId}] Promotions - '${promotionType.name}' ${scenario.description}`, async ({
					gamdomDb,
					promotionsPage,
					promotionAdminPage,
				}) => {
					promotionName = generateRandomString({
						prefix: "promotion_",
						length: 5,
					});

					await scenario.createPromotion(
						promotionType.insertMethod,
						gamdomDb,
						promotionName,
						userId,
					);

					await promotionAdminPage.navigate();
					await promotionAdminPage
						.assertThat()
						.promotionIsDisplayedInPromotionsTable(promotionName);
					await promotionAdminPage
						.assertThat()
						.verifyPromotionStatus(
							promotionName,
							scenario.initialStatus,
						);

					await promotionsPage.navigate();
					await promotionsPage.assertThat().promotionsPageIsLoaded();

					await scenario.initialVisibilityAssertion(
						promotionsPage,
						promotionName,
					);

					await scenario.action(gamdomDb, promotionName);

					await promotionAdminPage.navigate();
					await promotionAdminPage
						.assertThat()
						.promotionIsDisplayedInPromotionsTable(promotionName);
					await promotionAdminPage
						.assertThat()
						.verifyPromotionStatus(
							promotionName,
							scenario.finalStatus,
						);

					await promotionsPage.navigate();
					await promotionsPage.assertThat().promotionsPageIsLoaded();

					await scenario.finalVisibilityAssertion(
						promotionsPage,
						promotionName,
					);
				});
			});
		});
	});

	test.describe("Promotion creation tests", () => {
		test.fixme(
			isCI,
			"Skip on CI due to https://gamdom.atlassian.net/browse/ENG-7501",
		);
		promotionCombinations.forEach((combination) => {
			test(`[ENG-5576] Promotions - Create a new promotion - Promotion Category: ${combination.category} - Promotion Subcategory: ${combination.subCategory} - Is For VIP: ${combination.isForVip}`, async ({
				promotionAdminPage,
				promotionsModal,
				toast,
			}) => {
				promotionName = generateRandomString({
					prefix: `new_promotion_${combination.category}_${combination.subCategory}_${combination.isForVip}_`,
					length: 3,
				});
				const promotionTestData = new PromotionTestData({
					title: promotionName,
					customUrl: generateCustomUrl(promotionName),
					isForVip: PromotionIsVipCategories[combination.isForVip],
					promotionCategory:
						PromotionCategories[combination.category],
					promotionSubCategory:
						PromotionSubStatuses[combination.subCategory],
				});

				await promotionAdminPage.navigate();
				await promotionAdminPage.clickCreateNewPromotionButton();
				await promotionsModal.assertThat().modalIsDisplayed();
				await promotionsModal.fillPromotionsModalFields(
					promotionTestData,
				);
				await promotionsModal.clickSaveButton();
				await promotionsModal.assertThat().modalIsNotDisplayed();
				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.PROMOTION_CREATED_SUCCESSFULLY);
				await promotionAdminPage
					.assertThat()
					.promotionIsDisplayedInPromotionsTable(
						promotionTestData.title,
					);
			});
		});
	});
});
