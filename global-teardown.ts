import { AUTH_PATH } from "@constants/file-paths";
import { clearDirectoryContent } from "@core/utils/utils";

async function globalTeardown(): Promise<void> {
	await clearDirectoryContent(AUTH_PATH, ["auth.json"]);
}

export default globalTeardown;
