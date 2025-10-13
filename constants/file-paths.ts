import { getFilePath } from "@core/utils/utils";
import path from "path";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "./credentials";

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

export const BATCH_FREE_SPINS_FILE_PATH = path.resolve(
	__dirname,
	`../${TEST_FILES_DIR}/ENG-5008-batch-free-spins-upload.csv`,
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
