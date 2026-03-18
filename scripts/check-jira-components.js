#!/usr/bin/env node

/**
 * Script to check that all test files include at least one JiraComponent tag in testDetails().withTags()
 * Usage: node scripts/check-jira-components.js
 */

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const TESTS_DIR = "tests";

/**
 * Find all .spec.ts files recursively
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of matching file paths
 */
function findSpecFiles(dir) {
	const files = [];

	function traverse(currentDir) {
		const items = fs.readdirSync(currentDir);

		for (const item of items) {
			const fullPath = path.join(currentDir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				if (
					![
						"node_modules",
						".git",
						"dist",
						"build",
						"test-results",
						"playwright-report",
					].includes(item)
				) {
					traverse(fullPath);
				}
			} else if (stat.isFile() && item.endsWith(".spec.ts")) {
				files.push(fullPath);
			}
		}
	}

	traverse(dir);
	return files;
}

/**
 * Check if a spec file imports and uses JiraComponent in withTags()
 * @param {string} filePath - Path to the spec file
 * @returns {{hasImport: boolean, hasUsage: boolean, file: string}}
 */
function checkFile(filePath) {
	const content = fs.readFileSync(filePath, "utf8");

	const hasImport = /import\s*\{[^}]*JiraComponent[^}]*\}\s*from/.test(
		content,
	);
	const hasUsage = /\.withTags\([^)]*JiraComponent\.\w+/.test(content);

	return {
		hasImport: hasImport,
		hasUsage: hasUsage,
		file: filePath,
	};
}

function main() {
	console.log("Checking for missing JiraComponent tags in test files...\n");

	const projectRoot = process.cwd();
	const testsDir = path.join(projectRoot, TESTS_DIR);

	if (!fs.existsSync(testsDir)) {
		console.error(`Tests directory not found: ${testsDir}`);
		process.exit(1);
	}

	const specFiles = findSpecFiles(testsDir);
	const filesWithoutComponent = [];

	for (const file of specFiles) {
		const result = checkFile(file);

		if (!result.hasImport || !result.hasUsage) {
			filesWithoutComponent.push(path.relative(projectRoot, file));
		}
	}

	if (filesWithoutComponent.length === 0) {
		console.log(
			`All ${specFiles.length} test files have JiraComponent tags.`,
		);
	} else {
		console.log("Test files missing JiraComponent in withTags():\n");

		for (const file of filesWithoutComponent) {
			console.log(`  ${file}`);
		}

		console.log(`\nSummary:`);
		console.log(`  Files checked: ${specFiles.length}`);
		console.log(
			`  Files missing JiraComponent: ${filesWithoutComponent.length}`,
		);
		console.log(
			`\nEvery test file must include at least one JiraComponent tag via testDetails().withTags(JiraComponent.*).`,
		);

		process.exit(1);
	}
}

if (require.main === module) {
	main();
}

module.exports = { checkFile, findSpecFiles };
