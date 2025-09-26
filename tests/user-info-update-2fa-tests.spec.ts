import { DATASETS_DIR } from "@constants/file-paths";
import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	initializePageObjectsWithCookies,
	parse_csv,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { ContactType } from "@enums/personal-info-types";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "../fixtures/auth-fixtures";

const contactInfoInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.UPDATE_CONTACT_INFO_2FA_REQUIRED,
) as {
	field: ContactType;
}[];

test.describe("User info update tests", () => {
	test.describe.configure({ mode: "default" });
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserDB());

	contactInfoInputs.forEach((contactType) => {
		test(
			`[ENG-2567] Profile page - change ${contactType.field} - Require new 2FA code when IP of user changes`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({ profilePage, twoFactorAuthModal, browser }) => {
				const pages = {
					profilePage,
					twoFactorAuthModal,
				};
				const initialPage = await initializePageObjects(
					await browser.newContext(),
					...Object.values(pages),
				);

				await profilePage.navigate();
				await profilePage
					.steps()
					.updateContactInfoWithUniqueValue(
						contactType.field,
						true,
						qrCode2FAImagePath,
					);

				await profilePage
					.steps()
					.updateContactInfoWithUniqueValue(contactType.field, false);

				await initializePageObjectsWithCookies(
					await (await browser.newContext()).cookies(),
					initialPage,
					await createBrowserContextWithProxy(
						browser,
						PT_PROXY_CREDENTIALS,
					),
					...Object.values(pages),
				);

				await profilePage.navigate();
				await profilePage
					.steps()
					.updateContactInfoWithUniqueValue(
						contactType.field,
						true,
						qrCode2FAImagePath,
					);
			},
		);
	});
});
