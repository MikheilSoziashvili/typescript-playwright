import { promises as fs } from "fs";
import xml2js from "xml2js";
import * as Configuration from "configuration";
import { XmlData, XmlDataTestSuite, XmlDataTestCase } from "./types/types";

export async function parseXmlFile(filePath: string): Promise<XmlData> {
	try {
		const fileStat = await fs.stat(filePath);
		if (!fileStat.isFile()) {
			throw new Error(`File not found: ${filePath}`);
		}

		const xmlContent = await fs.readFile(filePath, { encoding: "utf8" });
		const parser = new xml2js.Parser();
		return parser.parseStringPromise(xmlContent) as Promise<XmlData>;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to parse XML file: ${error.message}`);
		} else {
			throw new Error(
				"Failed to parse XML file due to an unknown error.",
			);
		}
	}
}

export async function updateXmlWithTestKeys(
	filePath: string,
	xmlData: XmlData,
): Promise<void> {
	try {
		xmlData.testsuites.testsuite.forEach((suite: XmlDataTestSuite) => {
			suite.testcase.forEach((testcase: XmlDataTestCase) => {
				const match = testcase.$.name.match(
					new RegExp(`\\[(${Configuration.jira.projectKey}-\\d+)\\]`),
				);
				if (match) {
					if (!testcase.properties) {
						testcase.properties = [{ property: [] }];
					}
					testcase.properties[0].property.push({
						$: { name: "test_key", value: match[1] },
					});
				}
			});
		});

		const builder = new xml2js.Builder();
		const updatedXml = builder.buildObject(xmlData);
		await fs.writeFile(filePath, updatedXml);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to update XML with test keys: ${error.message}`,
			);
		} else {
			throw new Error(
				"Failed to update XML with test keys due to an unknown error.",
			);
		}
	}
}
