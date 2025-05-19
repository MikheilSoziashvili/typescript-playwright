import { test } from "@fixtures/fixtures";
import {
	getCookieHeader,
	parse_csv,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { Feature } from "@enums/feature";
import { Providers } from "@constants/providers";
import { RegisterTestData } from "@dtos/test-data";
import { ProviderDetails, VisibilityResult } from "@core/types/types";
import { GameProvider } from "@enums/game-providers";
import { Provider } from "@core/api/interfaces/provider";
import { CsvFilesName } from "@enums/csv-file-name";
import { UserType } from "@enums/user-types";

const adminEnableGames = parse_csv(
	DATASETS_DIR,
	CsvFilesName.ADMIN_ENABLE_GAMES,
) as {
	case: number;
	provider: string;
	featuresConfiguration: string;
	providersConfiguration: string;
	regular_user_result: VisibilityResult;
	beta_user_result: VisibilityResult;
}[];

// Map provider names to their corresponding feature enums
const providerToFeatureMap: Record<string, Feature> = {
	Hub88: Feature.HUB88_INTEGRATION,
	Hacksaw: Feature.HACKSAW_INTEGRATION,
	Pragmatic: Feature.PRAGMATIC_PLAY_INTEGRATION,
};

// Map configuration strings to their state representations for regular and beta users
const defineUserConfig = (regular: boolean, beta: boolean) => ({
	[UserType.REGULAR]: regular,
	[UserType.BETA]: beta,
});

const configToStates: Record<string, Partial<Record<UserType, boolean>>> = {
	both_enabled: defineUserConfig(true, true),
	regular_enabled: defineUserConfig(true, false),
	beta_enabled: defineUserConfig(false, true),
	both_disabled: defineUserConfig(false, false),
};

// Map provider names to their enums and additional properties
const providerEnumMap: Record<string, ProviderDetails> = {
	Hub88: Providers.kalamba,
	Hacksaw: Providers.hacksawGaming,
	Pragmatic: Providers.pragmaticPlay,
};

let initialProvidersState: Provider[] = [];

test.describe.serial("Admin Enable Game Provider tests @game-providers", () => {
	test.slow();

	/**
	 * Before all tests, authenticate as super admin and capture the initial state of all providers.
	 * This ensures we can reset the providers to their original state after tests have run.
	 */
	test.beforeAll(async ({ gamdomApi }) => {
		const superAdminCookie = getCookieHeader(
			await gamdomApi.authenticateWithExistingUser(
				SUPER_ADMIN_CREDENTIALS.username,
				SUPER_ADMIN_CREDENTIALS.password,
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
			hacksawHub.beta_users_only,
			hacksawHub.provider_id,
			hacksawHub.imported_from,
			{ Cookie: superAdminCookie },
		);
	});

	/**
	 * After all tests have completed, reset the providers to their initial state.
	 * This cleanup step ensures that the tests do not leave side effects.
	 */
	test.afterAll(async ({ gamdomApi }) => {
		const superAdminCookie = getCookieHeader(
			await gamdomApi.authenticateWithExistingUser(
				SUPER_ADMIN_CREDENTIALS.username,
				SUPER_ADMIN_CREDENTIALS.password,
			),
		);

		// Reset each provider to its original state
		for (const provider of initialProvidersState) {
			await gamdomApi.setProviderState(
				provider.id,
				provider.provider_name,
				provider.disabled,
				provider.beta_users_only,
				provider.provider_id,
				provider.imported_from,
				{ Cookie: superAdminCookie },
			);
		}

		// Set the specified features to enabled for both regular and beta users
		const featuresToEnable: Feature[] = [
			Feature.HUB88_INTEGRATION,
			Feature.HACKSAW_INTEGRATION,
			Feature.PRAGMATIC_PLAY_INTEGRATION,
		];

		for (const feature of featuresToEnable) {
			await gamdomApi.setFeatureState(
				feature,
				{ [UserType.REGULAR]: true, [UserType.BETA]: true },
				{ Cookie: superAdminCookie },
			);
		}
	});

	// Iterate over each test case record parsed from the CSV file
	adminEnableGames.forEach((record) => {
		// Determine the feature and provider states based on the test case configuration
		const featureStates = configToStates[record.featuresConfiguration];
		const providerStates = configToStates[record.providersConfiguration];
		const providerEnum = providerEnumMap[record.provider];
		const providerToFeature = providerToFeatureMap[record.provider];
		const regularEnabled = Boolean(providerStates[UserType.REGULAR]);
		const betaEnabled = Boolean(providerStates[UserType.BETA]);

		/**
		 * Define a test for each record.
		 * The test checks the visibility of game providers for regular and beta users
		 * based on the configured states.
		 */
		test(
			`[ENG-2745] Admin - enable a game provider only for beta users, test number: [${record.case}`,
			{
				annotation: {
					type: "bug",
					description: "https://gamdom.atlassian.net/browse/ENG-6552",
				},
			},
			async ({
				gamdomApi,
				homePage,
				casinoPage,
				providersPage,
				page,
			}) => {
				// Authenticate as super admin to perform administrative actions
				const superAdminCookie = getCookieHeader(
					await gamdomApi.authenticateWithExistingUser(
						SUPER_ADMIN_CREDENTIALS.username,
						SUPER_ADMIN_CREDENTIALS.password,
					),
				);

				// Set the feature state (enable/disable) for both regular and beta users
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
						provider.provider_name === providerEnum.providerName,
				) as Provider;

				// Extract the provider ID for use in setting provider state
				const providerId = targetProvider.id;

				// Set the provider state (enable/disable, beta users only) based on the test configuration
				await gamdomApi.setProviderState(
					providerId,
					providerEnum.providerName,
					!regularEnabled,
					betaEnabled,
					providerEnum.providerIdName,
					providerEnum.importedFrom,
					{ Cookie: superAdminCookie },
				);

				// Create test data for a regular user and a beta user
				const regularUserData = new RegisterTestData();
				const betaUserData = new RegisterTestData();

				// Register and authenticate the beta user
				await gamdomApi.authenticateWithNewUser(betaUserData);
				const betaUserId = (
					await gamdomApi.getBasicInfo(
						betaUserData.username,
						betaUserData.password,
					)
				).user.id;

				// Edit the beta user's info to assign the 'beta_user' tag
				await gamdomApi.editUserInfo(
					betaUserId,
					"beta_user",
					betaUserData.email,
					{ Cookie: superAdminCookie },
				);

				// ----- Gamdom home page casino hover menu ----- //
				// Authenticate with the beta user and verify provider visibility
				const betaUserCookie =
					await gamdomApi.authenticateWithExistingUser(
						betaUserData.username,
						betaUserData.password,
					);

				// Set authentication cookies in the browser for the beta user
				await setAuthenticationCookies(page, betaUserCookie);
				await homePage.navigateAndCheckTitle();

				// Verify that the provider is visible or not as expected for the beta user
				await homePage
					.assertThat()
					.verifyProviderState(
						providerEnum.providerName,
						record.beta_user_result,
					);

				// Authenticate with the regular user and verify provider visibility
				const regularUserCookie =
					await gamdomApi.authenticateWithNewUser(regularUserData);
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

				// Switch to the beta user and verify provider visibility in the dropdown
				await setAuthenticationCookies(page, betaUserCookie);

				await casinoPage.navigate();
				await casinoPage
					.steps()
					.verifyProviderDisplayedInDropdown(
						providerEnum.providerName as GameProvider,
						record.beta_user_result,
					);

				// ---- Casino page provider filter dropdown in "Pick Random" feature settings ---- //
				// Verify provider visibility in the "Pick Random" settings modal for the beta user
				await casinoPage.navigate();
				await casinoPage
					.steps()
					.verifyProviderDisplayedInSettingsModalDropdown(
						providerEnum.providerName as GameProvider,
						record.beta_user_result,
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

				// Switch to the beta user and verify provider option state
				await setAuthenticationCookies(page, betaUserCookie);
				await providersPage
					.steps()
					.verifyProviderOptionState(
						providersPage,
						record.beta_user_result,
						providerEnum.providerName as GameProvider,
					);

				// ---- Homepage provider belt ---- //
				// Verify that the provider is visible or not as expected for the beta user
				await homePage
					.steps()
					.verifyProviderOptionStateInBelt(
						homePage,
						providerEnum.providerName as GameProvider,
						record.beta_user_result,
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
});
