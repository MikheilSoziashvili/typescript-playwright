import { getFilePath } from "../core/utils";
import { SUPER_ADMIN_CREDENTIALS, USER_1_CREDENTIALS } from "./credentials";

const storageStateDir: string = getFilePath(".auth");

export const SUPER_ADMIN_AUTH_STATE_FILE_PATH = getFilePath(
	`${SUPER_ADMIN_CREDENTIALS.username}.json`,
	storageStateDir,
);
export const USER_1_AUTH_STATE_FILE_PATH = getFilePath(
	`${USER_1_CREDENTIALS.username}.json`,
	storageStateDir,
);
