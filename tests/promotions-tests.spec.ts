import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateCustomUrl,
	generateRandomString,
	getISODate,
	getRandomNumber,
	parse_csv,
	parseToBoolean,
} from "@core/utils/utils";
import { PromotionTestData, RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionIsVipCategories } from "@enums/promotion-is-vip-categories";
import { PromotionStatuses } from "@enums/promotion-statuses";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";
import { PromotionType } from "@enums/promotion-types";
import { TestTag } from "@enums/test-tags";
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
	buttonText?: string,
	customUrl?: string,
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
			buttonText?: string,
			customUrl?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertDefaultPromotion(
				name,
				userId,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			),
	},
	[PromotionType.CASINO]: {
		name: PromotionType.CASINO,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			buttonText?: string,
			customUrl?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertCasinoPromotion(
				name,
				userId,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			),
	},
	[PromotionType.VIP]: {
		name: PromotionType.VIP,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			buttonText?: string,
			customUrl?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertVipPromotion(
				name,
				userId,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			),
	},
	[PromotionType.SPORTSBOOK]: {
		name: PromotionType.SPORTSBOOK,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			buttonText?: string,
			customUrl?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertSportsbookPromotion(
				name,
				userId,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			),
	},
	[PromotionType.LIVE_CASINO]: {
		name: PromotionType.LIVE_CASINO,
		insertMethod: (
			gamdomDb: GamdomDb,
			name: string,
			userId: number,
			startDate?: string,
			buttonText?: string,
			customUrl?: string,
			expirationDate?: string,
		) =>
			gamdomDb.insertLiveCasinoPromotion(
				name,
				userId,
				startDate,
				expirationDate,
				buttonText,
				customUrl,
			),
	},
};

const promotionTypes = Object.values(promotionTestData);

const promotionButtonTextInputValidations = parse_csv(
	DATASETS_DIR,
	CsvFilesName.PROMOTION_BUTTON_TEXT_INPUT_VALIDATIONS,
) as {
	buttonText: string;
	errorMessagePresence: BooleanValueString;
}[];

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

test.describe(
	"Promotion tests",
	testDetails()
		.withTags(JiraComponent.PROMOTIONS, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		let promotionName: string;
		let promotionNewName: string;
		let userId: number;

		test.slow();
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
			await gamdomDb.deletePromotionByTitle([
				promotionName,
				promotionNewName,
			]);
		});

		test.describe("Promotion expiration tests", () => {
			promotionTypes.forEach((promotionType) => {
				Object.values(testScenarios).forEach((scenario) => {
					test(
						`[${scenario.testId}] Promotions - '${promotionType.name}' ${scenario.description}`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({
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
								.promotionIsDisplayedInPromotionsTable(
									promotionName,
								);
							await promotionAdminPage
								.assertThat()
								.promotionStatusMatches(
									promotionName,
									scenario.initialStatus,
								);

							await promotionsPage.navigate();
							await promotionsPage
								.assertThat()
								.promotionsPageIsLoaded();

							await scenario.initialVisibilityAssertion(
								promotionsPage,
								promotionName,
							);

							await scenario.action(gamdomDb, promotionName);

							await promotionAdminPage.navigate();
							await promotionAdminPage
								.assertThat()
								.promotionIsDisplayedInPromotionsTable(
									promotionName,
								);
							await promotionAdminPage
								.assertThat()
								.promotionStatusMatches(
									promotionName,
									scenario.finalStatus,
								);

							await promotionsPage.navigate();
							await promotionsPage
								.assertThat()
								.promotionsPageIsLoaded();

							await scenario.finalVisibilityAssertion(
								promotionsPage,
								promotionName,
							);
						},
					);
				});
			});
		});

		test.describe("Promotion CRUD tests", () => {
			promotionCombinations.forEach((combination) => {
				test(
					`[ENG-5576] Promotions - Create a new promotion - Promotion Category: ${combination.category} - Promotion Subcategory: ${combination.subCategory} - Is For VIP: ${combination.isForVip}`,
					testDetails()
						.withTags(TestTag.LOCAL)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({ promotionAdminPage, promotionsModal, toast }) => {
						test.fixme(
							isCI,
							"Skip on CI due to https://gamdom.atlassian.net/browse/ENG-7501",
						);
						promotionName = generateRandomString({
							prefix: `new_promotion_${combination.category}_${combination.subCategory}_${combination.isForVip}_`,
							length: 3,
						});
						const promotionTestData = new PromotionTestData({
							title: promotionName,
							customUrl: generateCustomUrl(promotionName),
							isForVip:
								PromotionIsVipCategories[combination.isForVip],
							promotionCategory:
								PromotionCategories[combination.category],
							promotionSubCategory:
								PromotionSubStatuses[combination.subCategory],
						});

						await promotionAdminPage.navigate();
						await promotionAdminPage.clickCreateNewPromotionButton();
						await promotionsModal
							.steps()
							.fillPromotionSuccessfully(promotionTestData);
						await toast.assertThat().titleIs(ToastTitle.SUCCESS);
						await toast
							.assertThat()
							.subTitleIs(
								ToastSubTitle.PROMOTION_CREATED_SUCCESSFULLY,
							);
						await promotionAdminPage
							.assertThat()
							.promotionIsDisplayedInPromotionsTable(
								promotionTestData.title,
							);
					},
				);
			});

			promotionTypes.forEach((promotionType) => {
				test(
					`[ENG-5735] Promotions - Delete '${promotionType.name}' active promotion`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({
						promotionAdminPage,
						promotionsModal,
						toast,
						gamdomDb,
					}) => {
						promotionName = generateRandomString({
							prefix: `${promotionType.name.toLowerCase()}_promotion_`,
							length: 5,
						});

						await promotionType.insertMethod(
							gamdomDb,
							promotionName,
							userId,
						);

						await promotionAdminPage.navigate();
						await promotionAdminPage
							.assertThat()
							.promotionIsDisplayedInPromotionsTable(
								promotionName,
							);
						await promotionAdminPage.clickDeletePromotionButton(
							promotionName,
						);

						await promotionsModal
							.steps()
							.deletePromotionSuccessfully();
						await toast.assertThat().titleIs(ToastTitle.SUCCESS);
						await toast
							.assertThat()
							.subTitleIs(ToastSubTitle.PROMOTION_DELETED);
						await promotionAdminPage
							.assertThat()
							.promotionIsNotDisplayedInPromotionsTable(
								promotionName,
							);
					},
				);
			});

			promotionTypes.forEach((promotionType) => {
				promotionCombinations.forEach((combination) => {
					test(
						`[ENG-5736] Promotions - Update '${promotionType.name}' active promotion. Promotion Category: ${combination.category} - Promotion Subcategory: ${combination.subCategory} - Is For VIP: ${combination.isForVip}`,
						testDetails()
							.withTags(TestTag.LOCAL)
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({
							promotionAdminPage,
							promotionsModal,
							toast,
							gamdomDb,
						}) => {
							test.fixme(
								isCI,
								"Skip on CI due to https://gamdom.atlassian.net/browse/ENG-7501",
							);
							promotionName = generateRandomString({
								prefix: `${promotionType.name.toLowerCase()}_promotion_`,
								length: 5,
							});

							promotionNewName = generateRandomString({
								prefix: `new_${promotionType.name.toLowerCase()}_promotion_`,
								length: 5,
							});

							const randomPromotionPriority = getRandomNumber(2);
							const promotionTestData = new PromotionTestData({
								title: promotionNewName,
								customUrl: generateCustomUrl(promotionNewName),
								isForVip:
									PromotionIsVipCategories[
										combination.isForVip
									],
								promotionCategory: PromotionCategories.ALL,
								promotionSubCategory: PromotionSubStatuses.NONE,
								priority: randomPromotionPriority,
							});

							await promotionType.insertMethod(
								gamdomDb,
								promotionName,
								userId,
							);

							await promotionAdminPage.navigate();
							await promotionAdminPage
								.assertThat()
								.promotionIsDisplayedInPromotionsTable(
									promotionName,
								);

							await promotionAdminPage.clickEditPromotionButton(
								promotionName,
							);
							await promotionsModal
								.steps()
								.fillPromotionSuccessfully(promotionTestData);
							await toast
								.assertThat()
								.titleIs(ToastTitle.SUCCESS);
							await toast
								.assertThat()
								.subTitleIs(
									ToastSubTitle.PROMOTION_UPDATED_SUCCESSFULLY,
								);

							await promotionAdminPage
								.assertThat()
								.promotionDataMatches(
									promotionNewName,
									PromotionStatuses.ACTIVE,
									randomPromotionPriority,
									PromotionCategories.ALL,
									promotionTestData.buttonLink,
								);
						},
					);
				});
			});

			test.describe("Promotion verifications tests", () => {
				promotionButtonTextInputValidations.forEach((validation) => {
					test(
						`[ENG-6121] Promotions - Promotion modal - Verify 'Play Now' button input text field validation - ${validation.buttonText}`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ promotionAdminPage, promotionsModal }) => {
							await promotionAdminPage.navigate();
							await promotionAdminPage.clickCreateNewPromotionButton();
							await promotionsModal
								.assertThat()
								.modalIsDisplayed();
							await promotionsModal
								.steps()
								.fillPromotionButtonTextInputAndVerifyErrorMessagePresence(
									validation.buttonText,
									parseToBoolean(
										validation.errorMessagePresence,
									),
								);
						},
					);
				});

				promotionTypes.forEach((promotionType) => {
					test(
						`[ENG-6121] Promotions - Promotion button text verification - ${promotionType.name}`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ gamdomDb, promotionPage }) => {
							promotionName = generateRandomString({
								prefix: `${promotionType.name.toLowerCase()}_promotion_`,
								length: 5,
							});
							const customButtonText = `${promotionType.name} Button`;
							const customUrl = generateCustomUrl(promotionName);

							await promotionType.insertMethod(
								gamdomDb,
								promotionName,
								userId,
								getISODate({ daysOffset: -1 }),
								customButtonText,
								customUrl,
							);

							await promotionPage.navigateToPromotion(customUrl);
							await promotionPage
								.assertThat()
								.promotionRewardsButtonHasText(
									customButtonText,
								);
							await promotionPage
								.assertThat()
								.promotionHowToParticipateButtonHasText(
									customButtonText,
								);
						},
					);
				});
			});
		});
	},
);
