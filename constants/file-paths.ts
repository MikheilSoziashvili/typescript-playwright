import { getFilePath } from "@core/utils/utils";
import path from "path";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "./credentials";
import { ImageSize } from "@enums/img/image-sizes";

export const storageStateDir: string = getFilePath(
	".auth",
	path.resolve(__dirname, "../core"),
);

export const DATASETS_DIR = "datasets";
export const TEST_FILES_DIR = "test-files";
export const AUTH_PATH = "core/.auth";
export const DATASETS_DIR_PATH = path.join(
	path.resolve(__dirname),
	"..",
	DATASETS_DIR,
);

export const GOOGLE_AUTH_STATE_FILE_PATH: string = getFilePath(
	`${GOOGLE_AUTH_CREDENTIALS.username}.json`,
	storageStateDir,
);
export const SUPER_ADMIN_AUTH_STATE_FILE_PATH: string = getFilePath(
	`${SUPER_ADMIN_CREDENTIALS.username}.json`,
	storageStateDir,
);
export const USER_1_AUTH_STATE_FILE_PATH: string = getFilePath(
	`${USER_1_CREDENTIALS.username}.json`,
	storageStateDir,
);

export const BATCH_FREE_SPINS_SUCCESS_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-5008-batch-free-spins-successful-upload.csv`,
);

export const BATCH_FREE_SPINS_PARTIAL_FAIL_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-5008-batch-free-spins-partial-fail-upload.csv`,
);

export const EV_REWARD_FREE_SPINS_FILE_MAP = {
	one_pass: path.resolve(
		__dirname,
		`../${TEST_FILES_DIR}/ENG-7499-users-1-pass.csv`,
	),
	threeHundred_fail: path.resolve(
		__dirname,
		`../${TEST_FILES_DIR}/ENG-7499-users-300-fail.csv`,
	),
	thousand_pass: path.resolve(
		__dirname,
		`../${TEST_FILES_DIR}/ENG-7499-users-1k-pass.csv`,
	),
} as const;

export const ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP = {
	[ImageSize.ABOVE_1MB]: path.resolve(
		__dirname,
		`../${TEST_FILES_DIR}/ENG-7574-blog-post-above-1mb-image.png`,
	),
	[ImageSize.BELOW_1MB]: path.resolve(
		__dirname,
		`../${TEST_FILES_DIR}/ENG-7574-blog-post-below-1mb-image.png`,
	),
} as const;

export const CSV_OUT_DIR_EV_REWARDS = path.dirname(
	EV_REWARD_FREE_SPINS_FILE_MAP.thousand_pass,
);

export const BULK_TIP_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-7780-bulk-tip-upload.csv`,
);

export const REVOKE_FREE_SPINS_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-7506-revoke-free-spins.csv`,
);

export const FREE_SPINS_REWARD_MILESTONES = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-7504-free-spins-reward-milestones.csv`,
);

export const KYC_LEVEL_3_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/sample_image.jpg`,
);

export const LARGE_KYC_LEVEL_3_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/png_6mb.png`,
);

export const PDF_KYC_LEVEL_3_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/pdf_1mb.pdf`,
);
