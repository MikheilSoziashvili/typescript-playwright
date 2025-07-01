import { generateRandomString } from "@core/utils/utils";
import { PromotionStatuses } from "@enums/promotion-statuses";
import { PromotionType } from "@enums/promotion-types";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
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

test.describe("Promotion tests", () => {
	let promotionName: string;
	test.use(storageStateNewSuperAdminUserDB());

	test.afterEach(async ({ gamdomDb }) => {
		await gamdomDb.deletePromotionByTitle(promotionName);
	});

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
				.verifyPromotionStatus(promotionName, PromotionStatuses.ACTIVE);

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
