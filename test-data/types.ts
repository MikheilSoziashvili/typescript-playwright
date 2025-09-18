import { predefinedDataScenarios } from "./scenarios/predefined-data-scenarios";
import { predefined } from "./sources/predefined";
import { predefinedRandom } from "./sources/predefined-random";

export type PredefinedData = typeof predefined;
export type PredefinedRandomData = typeof predefinedRandom;
export type PredefinedScenariosData = typeof predefinedDataScenarios;
