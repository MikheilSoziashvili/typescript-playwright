import { domainRegistry } from "./domains";
import { objectFactoryRegistry } from "./objects";
import { predefinedDataScenarios } from "./scenarios/predefined-data-scenarios";
import { predefined } from "./sources/predefined";
import { predefinedRandom } from "./sources/predefined-random";
import { RandomDataSourceGenerator } from "./sources/random";

export type PredefinedData = typeof predefined;
export type PredefinedRandomData = typeof predefinedRandom;
export type RandomData = InstanceType<typeof RandomDataSourceGenerator>;
export type PredefinedScenariosData = typeof predefinedDataScenarios;
export type DomainNames = keyof typeof domainRegistry;
export type DomainInstances = {
	[K in DomainNames]: InstanceType<(typeof domainRegistry)[K]>;
};
export type ObjectFactoryNames = keyof typeof objectFactoryRegistry;
export type ObjectFactoryInstances = {
	[K in ObjectFactoryNames]: (typeof objectFactoryRegistry)[K];
};
