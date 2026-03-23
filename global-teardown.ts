import { AUTH_PATH } from "@constants/file-paths";
import { clearDirectoryContent } from "@core/utils/utils";
import { writeFileSync } from "fs";

async function globalTeardown(): Promise<void> {
	await clearDirectoryContent(AUTH_PATH, ["auth.json"]);

	if (process.env.RP_LAUNCH_UUID) {
		writeFileSync(".rp-launch-uuid", process.env.RP_LAUNCH_UUID);
		process.env.RP_LAUNCH_ID = process.env.RP_LAUNCH_UUID;
	}
}

export default globalTeardown;
