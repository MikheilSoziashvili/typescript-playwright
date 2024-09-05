import { test } from "@fixtures/fixtures";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { CasinoGameName } from "@enums/casino-game";
import { USER_1_ID } from "@constants/user-ids";
import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";

test.describe("Grant free spins", () => {
	test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));
	test("[ENG-932] Granting free spins", async ({
		vipManagerAdminPage,
		toast,
	}) => {
		await vipManagerAdminPage.navigate();

		await vipManagerAdminPage.steps().getFreeSpins({
			userId: USER_1_ID,
			gameName: CasinoGameName.BARREL_BONANZA,
			betAmount: 100,
		});

		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
		});
		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.CASION_REWARD_GIVEN,
		});
	});
});
