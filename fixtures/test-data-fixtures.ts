import { test as base } from "@playwright/test";
import { DomainDataSource } from "test-data/core/domain-data-source";
import { ObjectDataSource } from "test-data/core/object-data-source";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";
import { PredefinedRandomDataSource } from "test-data/core/predefined-random-data-source";
import { RandomDataSource } from "test-data/core/random-data-source";
import { predefinedDataScenarios } from "test-data/scenarios/predefined-data-scenarios";
import { testData, TestDataManager } from "test-data/test-data-manager";
import { PredefinedScenariosData } from "test-data/types";

export type TestDataFixtures = {
	testData: TestDataManager;
	testDataPredefined: PredefinedDataSource;
	testDataPredefinedRandom: PredefinedRandomDataSource;
	testDataRandom: RandomDataSource;
	testDataDomain: DomainDataSource;
	testDataObject: ObjectDataSource;
	testDataScenarios: PredefinedScenariosData;
};

export const testDataFixtures = base.extend<TestDataFixtures>({
	testData: async ({}, use) => {
		await use(testData());
	},
	testDataPredefined: async ({}, use) => {
		await use(testData().fromPredefined());
	},
	testDataPredefinedRandom: async ({}, use) => {
		await use(testData().fromPredefinedRandom());
	},
	testDataRandom: async ({}, use) => {
		await use(testData().fromRandom());
	},
	testDataDomain: async ({}, use) => {
		await use(testData().fromDomain());
	},
	testDataObject: async ({}, use) => {
		await use(testData().fromObject());
	},
	testDataScenarios: async ({}, use) => {
		await use(predefinedDataScenarios);
	},
});
