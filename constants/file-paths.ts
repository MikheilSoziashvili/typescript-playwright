import { getFilePath } from "@core/utils/utils";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "./credentials";
import path from "path";

export const storageStateDir: string = getFilePath(
	".auth",
	path.resolve(__dirname, "../core"),
);

export const DATASETS_DIR = "datasets";
export const TEST_FILES_DIR = "test-files";
export const AUTH_PATH = "core/.auth";

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
