import { BATCH_FREE_SPINS_FILE_PATH } from "@constants/file-paths";
import { SUPER_HIGH_USER_AMOUNT } from "@constants/user-amounts";
import { USER_1_ID } from "@constants/user-ids";
import { CasinoGameName } from "@enums/casino-game";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Grant free spins", () => {
	test.use(
		storageStateNewSuperAdminUserDB({ amount: SUPER_HIGH_USER_AMOUNT }),
	);
	test("[ENG-932] Granting free spins", async ({
		freeSpinsAdminPage,
		toast,
	}) => {
		await freeSpinsAdminPage.navigate();

		await freeSpinsAdminPage.steps().getFreeSpins({
			userId: USER_1_ID,
			gameName: CasinoGameName.BARREL_BONANZA,
			betAmount: 100,
		});

		await toast.assertThat().titlesAre([
			{
				title: ToastTitle.SUCCESS,
				subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
			},
			{
				title: ToastTitle.SUCCESS,
				subTitle: ToastSubTitle.CASINO_REWARD_GIVEN,
			},
		]);
	});

	test("[ENG-5008] Granting free spins in batch", async ({
		freeSpinsAdminPage,
		toast,
	}) => {
		await freeSpinsAdminPage.navigate();

		await freeSpinsAdminPage
			.steps()
			.uploadBatchFreeSpinsFile(BATCH_FREE_SPINS_FILE_PATH);

		await freeSpinsAdminPage.steps().getFreeSpins({
			gameName: CasinoGameName.BARREL_BONANZA,
			betAmount: 100,
		});

		await toast.assertThat().titlesAre([
			{
				title: ToastTitle.SUCCESS,
				subTitle: ToastSubTitle.SENDING_OUT_FREESPINS,
			},
			{
				title: ToastTitle.SUCCESS,
				subTitle: ToastSubTitle.CASINO_REWARD_GIVEN,
			},
		]);
	});
});
