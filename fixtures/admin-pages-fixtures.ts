import { test as base } from "@playwright/test";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { InfoAdminPage } from "@pages/admin/info-admin/info-admin-page";
import { VipManagerAdminPage } from "@pages/admin/vip-manager-admin/vip-manager-admin-page";

export type AdminPages = {
	userInfoAdminPage: UserInfoAdminPage;
	infoAdminPage: InfoAdminPage;
	vipManagerAdminPage: VipManagerAdminPage;
};

export const adminPagesFixtures = base.extend<AdminPages>({
	userInfoAdminPage: async ({ page }, use) => {
		await use(new UserInfoAdminPage(page));
	},
	infoAdminPage: async ({ page }, use) => {
		await use(new InfoAdminPage(page));
	},
	vipManagerAdminPage: async ({ page }, use) => {
		await use(new VipManagerAdminPage(page));
	},
});
