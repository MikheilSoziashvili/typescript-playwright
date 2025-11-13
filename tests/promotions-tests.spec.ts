import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	formatDate,
	generateCustomUrl,
	generateRandomString,
	getISODate,
	getRandomNumber,
	parse_csv,
	parseToBoolean,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { PromotionTestData } from "@dtos/test-data";
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
import { PromotionTime } from "@enums/promotion-time";
import { PromotionType } from "@enums/promotion-types";
import { TestTag } from "@enums/test-tags";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { PromotionsPage } from "@pages/promotions/promotions-page";
import { isScheduledRun } from "configuration";
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
		test.describe.configure({ mode: "default" });

		let promotionName: string;
		let promotionNewName: string;
		let promotionsToDelete: string[] = [];

		test.slow();

		test.beforeEach(async ({ page, gamdomApiDbFacade }) => {
			const { cookie } =
				await gamdomApiDbFacade.createSingleUserDbAndAuth({
					tags: UserTags.PromotionAdmin,
					userClass: UserClasses.Admin,
					emailVerified: true,
					useGamdomEmailDomain: true,
				});

			await setAuthenticationCookies(page, cookie);
		});

		test.afterEach(async ({ gamdomDb }) => {
			await gamdomDb.deletePromotionByTitle(promotionsToDelete);
			promotionsToDelete = [];
		});

		test.describe("Promotion expiration tests", () => {
			promotionTypes.forEach((promotionType) => {
				Object.values(testScenarios).forEach((scenario) => {
					test(
						`[${scenario.testId}] Promotions - '${promotionType.name}' ${scenario.description}`,
						testDetails()
							.withJiraBugTickets("8897", "8964")
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({
							gamdomDb,
							promotionsPage,
							promotionAdminPage,
							gamdomApiDbFacade,
						}) => {
							const { user: promotionAdmin } =
								await gamdomApiDbFacade.createSingleUserDbAndAuth(
									{
										tags: UserTags.PromotionAdmin,
										userClass: UserClasses.Admin,
										emailVerified: true,
										useGamdomEmailDomain: true,
									},
								);
							promotionName = generateRandomString({
								prefix: "promotion_",
								length: 5,
							});
							promotionsToDelete.push(promotionName);

							await scenario.createPromotion(
								promotionType.insertMethod,
								gamdomDb,
								promotionName,
								promotionAdmin.userId,
							);

							await promotionAdminPage.navigate();
							await promotionAdminPage
								.steps()
								.checkPromotionIsDisplayedInPromotionsTable(
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
								.steps()
								.checkPromotionIsDisplayedInPromotionsTable(
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
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.withTags(TestTag.PLATFORM_BUG)
						.withJiraBugTickets("8964")
						.apply(),
					async ({ promotionAdminPage, promotionsModal, toast }) => {
						test.fixme(isScheduledRun);
						promotionName = generateRandomString({
							prefix: `new_promotion_${combination.category}_${combination.subCategory}_${combination.isForVip}_`,
							length: 3,
						});
						promotionsToDelete.push(promotionName);

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
							.steps()
							.checkPromotionIsDisplayedInPromotionsTable(
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
						gamdomApiDbFacade,
					}) => {
						const { user: promotionAdmin } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth({
								tags: UserTags.PromotionAdmin,
								userClass: UserClasses.Admin,
								emailVerified: true,
								useGamdomEmailDomain: true,
							});
						promotionName = generateRandomString({
							prefix: `${promotionType.name.toLowerCase()}_promotion_`,
							length: 5,
						});
						promotionsToDelete.push(promotionName);

						await promotionType.insertMethod(
							gamdomDb,
							promotionName,
							promotionAdmin.userId,
						);

						await promotionAdminPage.navigate();
						await promotionAdminPage
							.steps()
							.checkPromotionIsDisplayedInPromotionsTable(
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
				test(
					`[ENG-7398] Promotions - Duplicate '${promotionType.name}' existing promotion`,
					testDetails()
						.withAuthor(JiraUser.RALUCA_ARITON)
						.withTags(TestTag.PLATFORM_BUG)
						.withJiraBugTickets("8964")
						.apply(),
					async ({
						promotionAdminPage,
						promotionsModal,
						gamdomApiDbFacade,
						promotionsPage,
					}) => {
						test.fixme(isScheduledRun);

						await gamdomApiDbFacade.createSingleUserDbAndAuth({
							tags: UserTags.PromotionAdmin,
							userClass: UserClasses.Admin,
							emailVerified: true,
							useGamdomEmailDomain: true,
						});
						promotionName = generateRandomString({
							prefix: `${promotionType.name.toLowerCase()}_promotion_`,
							length: 5,
						});
						promotionsToDelete.push(promotionName);

						const promotionTestData = new PromotionTestData({
							title: promotionName,
							customUrl: generateCustomUrl(promotionName),
							isForVip: PromotionIsVipCategories.ALL,
							promotionCategory: PromotionCategories.CASINO,
							promotionSubCategory: PromotionSubStatuses.CASINO,
							promotionStartDate: formatDate(3),
							promotionEndDate: formatDate(5),
							promotionStartTime: PromotionTime.START_TIME,
							promotionEndTime: PromotionTime.END_TIME,
						});

						await promotionAdminPage.navigate();
						await promotionAdminPage.clickCreateNewPromotionButton();
						await promotionsModal
							.steps()
							.fillPromotionSuccessfully(promotionTestData);

						const expectedPromotionData = {
							...promotionTestData,
							promotionStartDate: formatDate(1),
							promotionEndDate: formatDate(3),
							promotionStartTime: PromotionTime.DEFAULT_TIME,
							promotionEndTime: PromotionTime.DEFAULT_TIME,
						};

						const duplicatedPromotionTitle = `${expectedPromotionData.title} (Copy)`;
						const duplicatedPromotionTitleSecond = `${duplicatedPromotionTitle} (Copy)`;
						promotionsToDelete.push(
							duplicatedPromotionTitle,
							duplicatedPromotionTitleSecond,
						);

						const cleanedCustomUrl =
							expectedPromotionData.customUrl.replaceAll("-", "");
						const duplicatedPromotionUrl = `${cleanedCustomUrl}-copy`;
						const duplicatedPromotionUrlSecond = `${duplicatedPromotionUrl}-copy`;

						await promotionAdminPage
							.steps()
							.checkPromotionIsDisplayedInPromotionsTable(
								promotionName,
							);

						await promotionAdminPage.clickDuplicatePromotionButton(
							promotionName,
						);
						await promotionsModal
							.assertThat()
							.duplicatePromotionHasLoaded(
								duplicatedPromotionTitle,
								duplicatedPromotionUrl,
								PromotionTime.DEFAULT_TIME,
								expectedPromotionData,
							);
						await promotionsModal.clickSaveButton();

						await promotionAdminPage
							.steps()
							.checkPromotionIsDisplayedInPromotionsTable(
								duplicatedPromotionTitle,
							);

						await promotionAdminPage.clickDuplicatePromotionButton(
							duplicatedPromotionTitle,
						);

						await promotionsModal
							.assertThat()
							.duplicatePromotionHasLoaded(
								duplicatedPromotionTitleSecond,
								duplicatedPromotionUrlSecond,
								PromotionTime.DEFAULT_TIME,
								expectedPromotionData,
							);
						await promotionsModal.clickSaveButton();

						await promotionsPage
							.steps()
							.activateAndSetVisibleDuplicatedPromotions(
								duplicatedPromotionTitle,
								duplicatedPromotionTitleSecond,
							);

						await promotionsPage.navigate();
						await promotionsPage
							.assertThat()
							.promotionsPageIsLoaded();

						await promotionsPage
							.steps()
							.verifyDuplicatedPromotionsAreDisplayed(
								duplicatedPromotionTitle,
								duplicatedPromotionTitleSecond,
							);
					},
				);
			});

			promotionTypes.forEach((promotionType) => {
				promotionCombinations.forEach((combination) => {
					test(
						`[ENG-5736] Promotions - Update '${promotionType.name}' active promotion. Promotion Category: ${combination.category} - Promotion Subcategory: ${combination.subCategory} - Is For VIP: ${combination.isForVip}`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.withTags(TestTag.PLATFORM_BUG)
							.withJiraBugTickets("8964")
							.apply(),
						async ({
							promotionAdminPage,
							promotionsModal,
							toast,
							gamdomDb,
							gamdomApiDbFacade,
						}) => {
							test.fixme(isScheduledRun);
							const { user: promotionAdmin } =
								await gamdomApiDbFacade.createSingleUserDbAndAuth(
									{
										tags: UserTags.PromotionAdmin,
										userClass: UserClasses.Admin,
										emailVerified: true,
										useGamdomEmailDomain: true,
									},
								);
							promotionName = generateRandomString({
								prefix: `${promotionType.name.toLowerCase()}_promotion_`,
								length: 5,
							});
							promotionNewName = generateRandomString({
								prefix: `new_${promotionType.name.toLowerCase()}_promotion_`,
								length: 5,
							});
							promotionsToDelete.push(
								promotionName,
								promotionNewName,
							);
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
								promotionAdmin.userId,
							);
							await promotionAdminPage.navigate();
							await promotionAdminPage
								.steps()
								.checkPromotionIsDisplayedInPromotionsTable(
									promotionName,
								);
							await promotionAdminPage.clickEditPromotionButton(
								promotionName,
							);

							await promotionsModal
								.assertThat()
								.promotionHasLoaded(promotionName);

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
								.steps()
								.checkPromotionDataMatchesMaxPagination(
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

			test.describe(
				"Promotion verifications tests",
				testDetails().withJiraBugTickets("8964").apply(),
				() => {
					promotionButtonTextInputValidations.forEach(
						(validation) => {
							test(
								`[ENG-6121] Promotions - Promotion modal - Verify 'Play Now' button input text field validation - ${validation.buttonText}`,
								testDetails()
									.withAuthor(JiraUser.IVAYLO_STOYCHEV)
									.apply(),
								async ({
									promotionAdminPage,
									promotionsModal,
								}) => {
									await promotionAdminPage.navigate();
									await promotionAdminPage.clickCreateNewPromotionButton();
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
						},
					);

					promotionTypes.forEach((promotionType) => {
						test(
							`[ENG-6121] Promotions - Promotion button text verification - ${promotionType.name}`,
							testDetails()
								.withAuthor(JiraUser.IVAYLO_STOYCHEV)
								.apply(),
							async ({
								gamdomDb,
								promotionPage,
								gamdomApiDbFacade,
							}) => {
								const { user: promotionAdmin } =
									await gamdomApiDbFacade.createSingleUserDbAndAuth(
										{
											tags: UserTags.PromotionAdmin,
											userClass: UserClasses.Admin,
											emailVerified: true,
											useGamdomEmailDomain: true,
										},
									);
								promotionName = generateRandomString({
									prefix: `${promotionType.name.toLowerCase()}_promotion_`,
									length: 5,
								});
								promotionsToDelete.push(promotionName);
								const customButtonText = `${promotionType.name} Button`;
								const customUrl =
									generateCustomUrl(promotionName);

								await promotionType.insertMethod(
									gamdomDb,
									promotionName,
									promotionAdmin.userId,
									getISODate({ daysOffset: -1 }),
									customButtonText,
									customUrl,
								);

								await promotionPage.navigateToPromotion(
									customUrl,
								);
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
				},
			);
		});
	},
);
