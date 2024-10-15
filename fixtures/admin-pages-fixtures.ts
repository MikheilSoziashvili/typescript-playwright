import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { InfoAdminPage } from "@pages/admin/info-admin/info-admin-page";
import { SecurityAdminPage } from "@pages/admin/security-admin/security-admin-page";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { VipManagerAdminPage } from "@pages/admin/vip-manager/vip-manager-page";
import { WriterAdminPage } from "@pages/admin/writer-admin/writer-admin-page";
import { test as base } from "@playwright/test";

export type AdminPages = {
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: InfoAdminPage;
	freeSpinsAdminPage: FreeSpinsAdminPage;
	securityAdminPage: SecurityAdminPage;
	writerAdminPage: WriterAdminPage;
	vipManagerAdminPage: VipManagerAdminPage;
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
		await use(new SecurityAdminPage(page));
	},
	writerAdminPage: async ({ page }, use) => {
		await use(new WriterAdminPage(page));
	},
	vipManagerAdminPage: async ({ page }, use) => {
		await use(new VipManagerAdminPage(page));
	},
});
