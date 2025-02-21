import { DATASETS_DIR } from "@constants/file-paths";
import { NL_PROXY_CREDENTIALS } from "@constants/proxies";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	initializePageObjects,
	parse_csv,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { ContactType } from "@enums/personal-info-types";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";

const contactInfoInputs = parse_csv(
	DATASETS_DIR,
	CsvFilesName.UPDATE_CONTACT_INFO_2FA_REQUIRED,
) as {
	field: ContactType;
}[];

test.describe("User info update tests", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({ settingsPage }) => {
		qrCode2FAImagePath = createPngImagePath();
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserAPI());

	contactInfoInputs.forEach((contactType) => {
		test(`[ENG-2567] Profile page - change ${contactType.field} - Require new 2FA code when IP of user changes`, async ({
			profilePage,
			twoFactorAuthModal,
			browser,
		}) => {
			let context = await browser.newContext();
			const pages = {
				profilePage,
				twoFactorAuthModal,
			};
			const initialPage = await initializePageObjects(
				context,
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

			const cookies = await context.cookies();
			context = await browser.newContext({
				proxy: NL_PROXY_CREDENTIALS,
			});
			await context.addCookies(cookies);
			await initialPage.close();
			await initializePageObjects(context, ...Object.values(pages));

			await profilePage.navigate();
			await profilePage
				.steps()
				.updateContactInfoWithUniqueValue(
					contactType.field,
					true,
					qrCode2FAImagePath,
				);
		});
	});
});
