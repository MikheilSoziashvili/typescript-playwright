export interface ParsedTest {
	title: string;
	specId: string;
	filePath: string;
	line: number;
	stack?: string;
	annotations?: { type: string; description?: string }[];
	author?: string;
	expected: string;
	actual: string;
	steps: string;
}
