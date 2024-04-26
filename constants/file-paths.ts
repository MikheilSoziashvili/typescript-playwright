import { getFilePath } from "../core/utils";
import {
	GOOGLE_AUTH_CREDENTIALS,
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "./credentials";

const storageStateDir: string = getFilePath(".auth");

export const GOOGLE_AUTH_STATE_FILE_PATH = getFilePath(
	`${GOOGLE_AUTH_CREDENTIALS.username}.json`,
	storageStateDir,
);
export const SUPER_ADMIN_AUTH_STATE_FILE_PATH = getFilePath(
	`${SUPER_ADMIN_CREDENTIALS.username}.json`,
	storageStateDir,
);
export const USER_1_AUTH_STATE_FILE_PATH = getFilePath(
	`${USER_1_CREDENTIALS.username}.json`,
	storageStateDir,
);
