import { JsonData } from "@core/interfaces";
import { readFromJSONFile } from "@core/utils/utils";
import * as Configuration from "configuration";

export async function getKeystore(): Promise<JsonData> {
    return readFromJSONFile(Configuration.keystore);
  }
