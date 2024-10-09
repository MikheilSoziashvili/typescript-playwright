import { test as base } from "@playwright/test";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { InfoAdminPage } from "@pages/admin/info-admin/info-admin-page";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { SecurityAdminPage } from "@pages/admin/security-admin/security-admin-page";

export type AdminPages = {
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: InfoAdminPage;
	freeSpinsAdminPage: FreeSpinsAdminPage;
	securityAdminPage: SecurityAdminPage;
};

export const adminPagesFixtures = base.extend<AdminPages>({
	userInfoAdminPage: async ({ page }, use) => {
		await use(new UserInfoAdminPage(page));
	},
	infoAdminPage: async ({ page }, use) => {
		await use(new InfoAdminPage(page));
	},
	freeSpinsAdminPage: async ({ page }, use) => {
		await use(new FreeSpinsAdminPage(page));
	},
	securityAdminPage: async ({ page }, use) => {
		await use (new SecurityAdminPage(page));
	}
});
