import { TestStatus } from "@playwright/test";

export interface Annotation {
	type: string;
	description?: string;
}

export interface ErrorInfo {
	message?: string;
	stack?: string;
}

export interface Step {
	title: string;
	steps?: Step[];
}

export interface Result {
	status: TestStatus;
	error?: ErrorInfo;
	annotations?: Annotation[];
	steps?: Step[];
}

export interface Test {
	testId?: string;
	results: Result[];
	annotations?: Annotation[];
}

export interface Spec {
	title: string;
	tests: Test[];
	file: string;
	line: number;
	column: number;
	id?: string;
}

export interface Suite {
	title: string;
	file: string;
	line: number;
	column: number;
	suites?: Suite[];
	specs?: Spec[];
}

export interface PlaywrightReport {
	suites: Suite[];
}
