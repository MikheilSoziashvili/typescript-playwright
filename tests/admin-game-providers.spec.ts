import { DATASETS_DIR } from "@constants/file-paths";
import { Providers } from "@constants/providers";
import { Provider } from "@core/api/interfaces/provider";
import { testDetails } from "@core/helpers/test-details-helper";
import { ProviderDetails, VisibilityResult } from "@core/types/types";
import {
	getCookieHeader,
	parse_csv,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserClasses } from "@enums/db/user-classes";
import { UserTags } from "@enums/db/user-tags";
import { Feature } from "@enums/feature";
import { GameProvider } from "@enums/game-providers";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { UserType } from "@enums/user-types";
import { test } from "@fixtures/fixtures";

const adminEnableGames = parse_csv(
	DATASETS_DIR,
	CsvFilesName.ADMIN_ENABLE_GAMES,
) as {
	case: number;
	provider: string;
	featuresConfiguration: string;
	providersConfiguration: string;
	regular_user_result: VisibilityResult;
	qa_user_result: VisibilityResult;
}[];

// Map provider names to their corresponding feature enums
const providerToFeatureMap: Record<string, Feature> = {
	Hub88: Feature.HUB88_INTEGRATION,
	Hacksaw: Feature.HACKSAW_INTEGRATION,
	Pragmatic: Feature.PRAGMATIC_PLAY_INTEGRATION,
};

// Map configuration strings to their state representations for regular and qa users
const defineUserConfig = (regular: boolean, qa: boolean) => ({
	[UserType.REGULAR]: regular,
	[UserType.QA_USER]: qa,
});

const configToStates: Record<string, Partial<Record<UserType, boolean>>> = {
	both_enabled: defineUserConfig(true, true),
	regular_enabled: defineUserConfig(true, false),
	qa_enabled: defineUserConfig(false, true),
	both_disabled: defineUserConfig(false, false),
};

// Map provider names to their enums and additional properties
const providerEnumMap: Record<string, ProviderDetails> = {
	Hub88: Providers.kalamba,
	Hacksaw: Providers.hacksawGaming,
	Pragmatic: Providers.pragmaticPlay,
};

let initialProvidersState: Provider[] = [];

test.describe.serial(
	"Admin Enable Game Provider tests",
	testDetails().withTags(TestTag.SEQUENTIAL, TestTag.GAME_PROVIDERS).apply(),
	() => {
		test.slow();

		/**
		 * Before all tests, authenticate as super admin and capture the initial state of all providers.
		 * This ensures we can reset the providers to their original state after tests have run.
		 */
		test.beforeAll(async ({ gamdomApi, gamdomDb }) => {
			const superAdminData = new RegisterTestData({
				useGamdomEmailDomain: true,
			});
			await gamdomDb.createNewUser({
				username: superAdminData.username,
				password: superAdminData.password,
				email: superAdminData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const superAdminCookie = getCookieHeader(
				await gamdomApi.authenticateWithExistingUser(
					superAdminData.username,
					superAdminData.password,
				),
			);

			// Retrieve and store the initial state of all providers
			initialProvidersState = await gamdomApi.getProviders({
				Cookie: superAdminCookie,
			});

			// Temporary fix until we have control over imported Casino Providers upon redeploy so none have duplicated names
			const hacksawHub = initialProvidersState.find(
				(provider) => provider.producer_id === "Hacksaw Gaming",
			) as Provider;

			await gamdomApi.setProviderState(
				hacksawHub.id,
				"Hacksaw Gaming hub",
				hacksawHub.disabled,
				hacksawHub.qa_users_only,
				hacksawHub.provider_id,
				hacksawHub.imported_from,
				{ Cookie: superAdminCookie },
			);
		});

		/**
		 * After all tests have completed, reset the providers to their initial state.
		 * This cleanup step ensures that the tests do not leave side effects.
		 */
		test.afterAll(async ({ gamdomApi, gamdomDb }) => {
			const superAdminData = new RegisterTestData({
				useGamdomEmailDomain: true,
			});
			await gamdomDb.createNewUser({
				username: superAdminData.username,
				password: superAdminData.password,
				email: superAdminData.email,
				tags: UserTags.SuperAdmin,
				userClass: UserClasses.Admin,
				emailVerified: true,
			});
			const superAdminCookie = getCookieHeader(
				await gamdomApi.authenticateWithExistingUser(
					superAdminData.username,
					superAdminData.password,
				),
			);

			// Reset each provider to its original state
			for (const provider of initialProvidersState) {
				await gamdomApi.setProviderState(
					provider.id,
					provider.provider_name,
					provider.disabled,
					provider.qa_users_only,
					provider.provider_id,
					provider.imported_from,
					{ Cookie: superAdminCookie },
				);
			}

			// Set the specified features to enabled for both regular and qa users
			const featuresToEnable: Feature[] = [
				Feature.HUB88_INTEGRATION,
				Feature.HACKSAW_INTEGRATION,
				Feature.PRAGMATIC_PLAY_INTEGRATION,
			];

			for (const feature of featuresToEnable) {
				await gamdomApi.setFeatureState(
					feature,
					{ [UserType.REGULAR]: true, [UserType.QA_USER]: true },
					{ Cookie: superAdminCookie },
				);
			}
		});

		// Iterate over each test case record parsed from the CSV file
		adminEnableGames.forEach((record) => {
			// Determine the feature and provider states based on the test case configuration
			const featureStates = configToStates[record.featuresConfiguration];
			const providerStates =
				configToStates[record.providersConfiguration];
			const providerEnum = providerEnumMap[record.provider];
			const providerToFeature = providerToFeatureMap[record.provider];
			const regularEnabled = Boolean(providerStates[UserType.REGULAR]);
			const qaEnabled = Boolean(providerStates[UserType.QA_USER]);

			/**
			 * Define a test for each record.
			 * The test checks the visibility of game providers for regular and qa users
			 * based on the configured states.
			 */
			test(
				`[ENG-2745] Admin - enable a game provider only for qa users, test number: [${record.case}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({
					gamdomApi,
					gamdomDb,
					homePage,
					casinoPage,
					providersPage,
					page,
				}) => {
					// Authenticate as super admin to perform administrative actions
					const superAdminData = new RegisterTestData({
						useGamdomEmailDomain: true,
					});
					await gamdomDb.createNewUser({
						username: superAdminData.username,
						password: superAdminData.password,
						email: superAdminData.email,
						tags: UserTags.SuperAdmin,
						userClass: UserClasses.Admin,
						emailVerified: true,
					});
					const superAdminCookie = getCookieHeader(
						await gamdomApi.authenticateWithExistingUser(
							superAdminData.username,
							superAdminData.password,
						),
					);

					// Set the feature state (enable/disable) for both regular and qa users
					await gamdomApi.setFeatureState(
						providerToFeature,
						featureStates,
						{
							Cookie: superAdminCookie,
						},
					);

					// Retrieve all providers to find the target provider
					const providers = await gamdomApi.getProviders({
						Cookie: superAdminCookie,
					});

					// Find the target provider using its name
					const targetProvider = providers.find(
						(provider) =>
							provider.provider_name ===
							providerEnum.providerName,
					) as Provider;

					// Extract the provider ID for use in setting provider state
					const providerId = targetProvider.id;

					// Set the provider state (enable/disable, qa users only) based on the test configuration
					await gamdomApi.setProviderState(
						providerId,
						providerEnum.providerName,
						!regularEnabled,
						qaEnabled,
						providerEnum.providerIdName,
						providerEnum.importedFrom,
						{ Cookie: superAdminCookie },
					);

					// Create test data for a regular user and a qa user
					const regularUserData = new RegisterTestData();
					const qaUserData = new RegisterTestData();

					// Register and authenticate the qa user
					await gamdomDb.createNewUser({
						username: qaUserData.username,
						password: qaUserData.password,
						email: qaUserData.email,
						tags: UserTags.QaUser,
					});

					// ----- Gamdom home page casino hover menu ----- //
					// Authenticate with the qa user and verify provider visibility
					const qaUserCookie =
						await gamdomApi.authenticateWithExistingUser(
							qaUserData.username,
							qaUserData.password,
						);

					// Set authentication cookies in the browser for the qa user
					await setAuthenticationCookies(page, qaUserCookie);
					await homePage.navigateAndCheckTitle();

					// Verify that the provider is visible or not as expected for the qa user
					await homePage
						.assertThat()
						.verifyProviderState(
							providerEnum.providerName,
							record.qa_user_result,
						);

					// Authenticate with the regular user and verify provider visibility
					await gamdomDb.createNewUser(regularUserData);
					const regularUserCookie =
						await gamdomApi.authenticateWithExistingUser(
							regularUserData.username,
							regularUserData.password,
						);
					await setAuthenticationCookies(page, regularUserCookie);
					await homePage.navigateAndCheckTitle();

					// Verify that the provider is visible or not as expected for the regular user
					await homePage
						.assertThat()
						.verifyProviderState(
							providerEnum.providerName,
							record.regular_user_result,
						);

					// ---- Casino page provider filter dropdown ---- //
					// Navigate to the casino page as the regular user and verify provider visibility in the dropdown
					await casinoPage.navigate();
					await casinoPage
						.steps()
						.verifyProviderDisplayedInDropdown(
							providerEnum.providerName as GameProvider,
							record.regular_user_result,
						);

					// Switch to the qa user and verify provider visibility in the dropdown
					await setAuthenticationCookies(page, qaUserCookie);

					await casinoPage.navigate();
					await casinoPage
						.steps()
						.verifyProviderDisplayedInDropdown(
							providerEnum.providerName as GameProvider,
							record.qa_user_result,
						);

					// ---- Casino page provider filter dropdown in "Pick Random" feature settings ---- //
					// Verify provider visibility in the "Pick Random" settings modal for the qa user
					await casinoPage.navigate();
					await casinoPage
						.steps()
						.verifyProviderDisplayedInSettingsModalDropdown(
							providerEnum.providerName as GameProvider,
							record.qa_user_result,
						);

					// Switch back to the regular user and verify provider visibility in the settings modal
					await setAuthenticationCookies(page, regularUserCookie);

					await casinoPage.navigate();
					await casinoPage
						.steps()
						.verifyProviderDisplayedInDropdown(
							providerEnum.providerName as GameProvider,
							record.regular_user_result,
						);

					// ---- Providers page ---- //
					// Navigate to the providers page as the regular user and verify provider option state
					await providersPage
						.steps()
						.verifyProviderOptionState(
							providersPage,
							record.regular_user_result,
							providerEnum.providerName as GameProvider,
						);

					// Switch to the qa user and verify provider option state
					await setAuthenticationCookies(page, qaUserCookie);
					await providersPage
						.steps()
						.verifyProviderOptionState(
							providersPage,
							record.qa_user_result,
							providerEnum.providerName as GameProvider,
						);

					// ---- Homepage provider belt ---- //
					// Verify that the provider is visible or not as expected for the qa user
					await homePage
						.steps()
						.verifyProviderOptionStateInBelt(
							homePage,
							providerEnum.providerName as GameProvider,
							record.qa_user_result,
						);

					// Verify that the provider is visible or not as expected for the regular user
					await setAuthenticationCookies(page, regularUserCookie);
					await homePage
						.steps()
						.verifyProviderOptionStateInBelt(
							homePage,
							providerEnum.providerName as GameProvider,
							record.regular_user_result,
						);
				},
			);
		});
	},
);
