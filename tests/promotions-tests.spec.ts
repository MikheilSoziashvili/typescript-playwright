import { DATASETS_DIR } from "@constants/file-paths";
import {
	generateCustomUrl,
	generateRandomString,
	parse_csv,
} from "@core/utils/utils";
import { PromotionTestData } from "@dtos/test-data";
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
import { isCI } from "configuration";
import { GamdomDb } from "database/gamdom-db";

const promotionTypes = [
	{
		name: PromotionType.DEFAULT,
		createMethod: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.insertDefaultPromotion(name),
	},
	{
		name: PromotionType.CASINO,
		createMethod: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.insertCasinoPromotion(name),
	},
	{
		name: PromotionType.VIP,
		createMethod: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.insertVipPromotion(name),
	},
	{
		name: PromotionType.SPORTSBOOK,
		createMethod: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.insertSportsbookPromotion(name),
	},
	{
		name: PromotionType.LIVE_CASINO,
		createMethod: (gamdomDb: GamdomDb, name: string) =>
			gamdomDb.insertLiveCasinoPromotion(name),
	},
];

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

	test.use(
		storageStateNewUserDB({
			tags: UserTags.PromotionAdmin,
			userClass: UserClasses.Admin,
			emailVerified: true,
		}),
	);

	test.afterEach(async ({ gamdomDb }) => {
		await gamdomDb.deletePromotionByTitle(promotionName);
	});
	test.describe("Promotion expiration tests", () => {
		promotionTypes.forEach((promotionType) => {
			test(`[ENG-5515] Promotions - '${promotionType.name}' Promotion automatically go Expired when expiration_date expire`, async ({
				gamdomDb,
				promotionsPage,
				promotionAdminPage,
			}) => {
				promotionName = generateRandomString({
					prefix: `${promotionType.name}_promotion_`,
					length: 5,
				});

				await promotionType.createMethod(gamdomDb, promotionName);
				await promotionsPage.navigate();
				await promotionsPage
					.assertThat()
					.promotionIsDisplayedInPromotionsPage(promotionName);
				await promotionAdminPage.navigate();
				await promotionAdminPage
					.assertThat()
					.promotionIsDisplayedInPromotionsTable(promotionName);

				await promotionAdminPage
					.assertThat()
					.verifyPromotionStatus(
						promotionName,
						PromotionStatuses.ACTIVE,
					);

				await gamdomDb.expirePromotionByTitle(promotionName);

				await promotionAdminPage.navigate();
				await promotionAdminPage
					.assertThat()
					.promotionIsDisplayedInPromotionsTable(promotionName);
				await promotionAdminPage
					.assertThat()
					.verifyPromotionStatus(
						promotionName,
						PromotionStatuses.EXPIRED,
					);

				await promotionsPage.navigate();
				await promotionsPage
					.assertThat()
					.promotionIsNotDisplayedInPromotionsPage(promotionName);
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
				await promotionsModal.assertThat().modalIsNoDisplayed();
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
