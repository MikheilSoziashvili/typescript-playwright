# Gamdom UI E2E Automation Testing Framework

**Table of Contents**

-   [Overview](#overview)
-   [Getting Started](#getting-started)
-   [Prerequisites](#prerequisites)
-   [Project structure](#project-structure)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Running Tests](#running-tests)
-   [Writing Tests](#writing-tests)
-   [Reporting](#reporting)
-   [Best Practices](#best-practices)

## Overview

[Playwright](https://playwright.dev)-based test automation framework developed with Node.js and Typescript, designed for automated end-to-end testing of Gamdom web application.
Leveraging the power of Playwright as the next generation browser automation tool, this framework gives multiple enhanced opportunities and built-in features for more stable and easily manageble automated tests.

### Playwright Key Features

-   **Cross-browser testing**
    Testing web applications on different browsers including Chromium, Firefox and WebKit
-   **Headless and Headful Modes**
    The headless mode is ideal for running tests in a CI/CD pipeline or on a remote server, where a graphical interface is not required. On the other hand, the headful mode is useful for debugging and visually inspecting the browser during test execution
-   **Rich API and Built-in Wait Mechanisms**
    Playwright provides a rich API that allows developers to perform a wide range of actions, such as navigating to URLs, interacting with elements, filling forms, and capturing screenshots. Additionally, Playwright offers built-in wait mechanisms, such as waiting for elements to appear or disappear, waiting for network requests to complete, and waiting for specific conditions to be met. These features make it easier to write robust and reliable automation scripts.
-   **Device emulation:**
    With Playwright, developers can simulate user interactions on different devices and screen sizes. This enables thorough testing of responsive web designs and ensures that the application functions correctly on various devices, such as smartphones, tablets, and desktops
-   **Parallel Test Execution**
    Run tests in parallel to reduce the overall test execution time
-   **Multiple Integrations**
    Being integrated by various most popular tools for CI/CD, <abbr title="Test Case Management Systems">TCMS</abbr>, monitoring, reporting etc

## Getting Started

The instructions below will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

-   Node.js (>= 20.x)
-   yarn (>= 1.22.x)
-   IDE (preferrably VSCode)

## Project Structure

```plaintext
├── .env                                          # Environment variables configuration file (used only for local development)
├── .eslintrc.cjs                                 # ESLint configuration file
├── .github
│   ├── workflows                                 # GitHub Actions pipelines
├── .gitignore                                    # Git ignore file specifying untracked files
├── .prettierrc                                   # Prettier configuration file
├── README.md                                     # Project's README file
├── api                                           # API Clients
│   ├── base-api.ts                               # Base API Module
│   ├── gamdom-api-actions.ts                     # API Module containing actions with Gamdom API Client
│   ├── gamdom-api.ts                             # Gamdom API Client
│   ├── jira-api-payloads.ts                      # JIRA API payloads
│   ├── jira-api.ts                               # JIRA API Client
│   ├── mailinator-api.ts                         # Mailinator API Client
│   ├── xray-api.ts                               # XRay API Client
├── configuration.ts                              # Project configuration settings
├── constants                                     # Constants used throughout the project
├── core                                          # Project Core Packages
│   ├── .auth                                     # Location for saving storage state JSONs
│   ├── auth-mngmt.ts                             # Authentication management functions - create or use already created authentication state
│   ├── facades                                   # Facade classes
│   ├── helpers                                   # Helper functions and utilities
│   ├── interfaces.ts                             # TypeScript interfaces
│   ├── reporters                                 # Custom reporters
│   ├── types                                     # Type definitions
│   ├── utils                                     # Utility functions
├── datasets                                      # Test datasets in CSV format
├── test-files                                    # Test data files in all formats
├── decorators                                    # TS decorators
├── dtos                                          # Data transfer objects
├── enums                                         # Enumeration objects
├── fixtures                                      # Playwright fixtures
├── formulas                                      # Formulas for various calculations
├── global-setup.ts                               # Global setup function
├── global-teardown.ts                            # Global teardown function
├── keystore.json                                 # Key-value keystore
├── logger                                        # Logging functionality
│   ├── logger.ts                                 # Logger module
├── package.json                                  # Node.js package configuration
├── pages                                         # Page objects
│   ├── home-page                                 # Home page Custom Page Object Model (example)
│   │   ├── home-page-asserter.ts                 # Home page asserter module
│   │   ├── home-page-map.ts                      # Home page web elements module
│   │   ├── home-page-steps.ts                    # Home page steps module
│   │   ├── home-page.ts                          # Home page main class - gathers all modules and contains page actions
├── playwright.config.ts                          # Playwright configuration file
├── results.xml                                   # Test results in XML format (generated by and used in JIRA reporter)
├── scripts                                       # Utility scripts
│   ├── check-step-decorators.js                  # Script to detect missing @step decorators
│   ├── upload_to_s3.sh                           # Script to upload reports to S3
├── services
│   ├── db-pool-service                           # Standalone DB Pool Service
│       ├── enums                                 # DB Pool Service enums
│       ├── interfaces                            # DB Pool Service interfaces
│       ├── db-pool-server.ts                     # Express-based DB Pool Service implementation
│       ├── db-pool-service-manager.ts            # Manages the lifecycle of the DB Pool Service
│       ├── endpoints.ts                          # Service endpoints
│       ├── types.ts                              # DB Pool Service type definitions
│       ├── utils.ts                              # DB Pool Service utility functions
├── support                                       # Support files
│   ├── regex-patterns.ts                         # Regular expression patterns
├── test-data                                     # Test data management
│   ├── base                                      # Test data abstract base classes and shared logic
│   ├── core                                      # Test data core functionality
│   ├── domains                                   # Test data domain-specific datasets
│   ├── interfaces                                # Test data interfaces
│   ├── mappings                                  # Test data mappings for CSV file names and DTOs
│   ├── objects                                   # Test data object factories
│   ├── parsers                                   # Test data file parsers
│   ├── scenarios                                 # Test data predefined data bundles
│   ├── sources                                   # Test data sources (predefined, randomized etc)
│   ├── custom-exceptions.ts                      # Test data custom exceptions
│   ├── test-data-manager.ts                      # Test data manager
│   ├── types.ts                                  # Test data type definitions
├── tests                                         # Test suites
│   ├── visual                                    # Visual test suites
│   │   ├── homepage-visual.spec.ts               # Visual test suite (example)
│   │   ├── homepage-visual.spec.ts-snapshots     # Visual test suite's base images
├── tsconfig.json                                 # TypeScript configuration file
├── yarn.lock                                     # Yarn lockfile for package dependencies
```

## Installation

### Clone repository

Clone the repository and install the dependencies:
**Using HTTPS:**
`git clone https://github.com/smein-org/e2e.git`

**Using SSH:**
`git clone git@github.com:smein-org/e2e.git`

**Using Git GUI tool**
Git GUI tools such as [SourceTree](https://www.sourcetreeapp.com/ "SourceTree") simplify and provide visual representation of Git repositories.

### Install dependencies

```bash
cd <repository-root-directory>
yarn install
```

### Install Playwright browsers

`yarn playwright install`

## Configuration

The configuration settings for the automation framework are located in the **configuration.ts** file. This file exports constant variables that define various configuration options used throughout the project. These configuration variables can be imported in test files and other parts of the project. Some of the values are taken from environment variables, which are managed using the _[dotenv](https://github.com/motdotla/dotenv "dotenv")_ package.

### Environment Variables

For local development create a _.env_ file in the root of your project and add environment-specific variables.
For CI/CD ensure environment variables are injected into pipeline.

### Playwright Configuration File

In addition to the **configuration.ts** file, the framework also utilizes a **[playwright.config.ts](https://playwright.dev/docs/test-configuration)** Playwright configuration file to define global configuration settings for Playwright and the tests. It reads some of the values directly from **configuration.ts** module and applies them accordingly.
Also there is additional Playwright reporting configuration which depends on **configuration.ts** value and reflected into **playwright.config.ts**.

## Running Tests

-   **All tests**
    To run all tests, use:
    `yarn playwright test`

-   **Specific tests**
    `yarn playwright test path/to/testfile.spec.ts`

-   **By tag**
    `yarn playwright test --grep @myTag`

## Linting

To maintain code quality and consistency, we use a linter to check our codebase. Please ensure you run the linter before committing your code.

### Running the Linter

1. Navigate to the project root directory:
   `/path/to/your/project`

2. Run the standard linter:
   `yarn lint`

3. Check for missing @step decorators:
   `yarn lint:step-decorators`

### Linter Configuration

The linter is configured to check for syntax errors, coding style issues, and potential bugs. The configuration can be found in the `.eslintrc` file in the root directory of the project.

### Step Decorator Enforcement

Our E2E framework uses `@step` decorators to enhance test reporting and debugging. A custom linting script automatically detects missing `@step` decorators in:

-   `*-steps.ts` files
-   `*-asserter.ts` files
-   `*-page.ts` files

**Usage:**

```bash
yarn lint:step-decorators
```

**Sample Output:**

```
🔍 Checking for missing @step decorators...

❌ pages/admin/base-admin/base-admin-page.ts
   📍 Line 31: Method "clickOnAdminTab" is missing @step decorator

📊 Summary:
   📁 Files checked: 234
   ⚠️  Files with issues: 82
   🚫 Total missing decorators: 299
```

The script excludes methods, properties (`constructor`, `assertThat`, `steps`, `navigate`, `init`, `map`, `page`, `gamdomPage`) and private methods (starting with `_`).

### Installing ESLint in VS Code

For a better development experience, you can install the **[ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** in Visual Studio Code. This allows you to see linting errors and warnings directly in your editor.

### Code Formatting with Prettier

Install **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** extension to enable consistent formatting across the codebase. It ensures that all contributors follow the same style guide, which helps to avoid unnecessary differences in code formatting and makes the code more readable and maintainable. After the extension is installed, use the following **[guide](https://www.shecodes.io/athena/62871-how-to-set-prettier-as-default-formatter-in-your-editor)** to set prettier as a default formatter. Configuration of the Prettier formatter can be found in `.prettierrc` file in the root directory of the project.

## Writing Tests

The tests should be designed to efficiently and consistently validate the functionality of the application under test by mimicking user interactions and checking for expected outcomes.

### Main Test Components

The main approach used during writing tests is the Arrange-Act-Assert Pattern.
Combining custom modules and patterns along with the capabilities of Playwright allows for the creation of highly modular, scalable, and maintainable test that can handle complex testing scenarios efficiently.

#### Playwright Fixtures

[Playwright fixtures](https://playwright.dev/docs/test-fixtures) are used to set up the necessary preconditions, state and page objects for each test. Fixtures are reusable components that can initialize data, manage test dependencies, provide access to UI interaction methods, cleanup actions.

#### Page Object Model

The Page Object Model (POM) is a design pattern in test automation that enhances the maintainability and readability of test scripts. In POM, each web page (or significant page component) is represented by a corresponding class, which encapsulates the page’s elements and interactions. This abstraction layer allows tests to interact with the page objects rather than directly with the page elements, promoting code reuse and reducing duplication.
Read about [the Page Object Model by Playwright](https://playwright.dev/docs/pom)

**Custom Page Object Model** is utilized to represent and interact with the various pages and components of the application under test. Each Page Object class **consists of three classes** which respectively encapsulate **the page elements, interactions and assertions** of a specific page or component, providing a clear and maintainable abstraction layer for test scripts.
There is an additional **steps** component added to the model, which serves as collection of multiple consecutive actions and assertions performed on the page. This helps for better test readability, maintenance and organization of actions and assertions.

#### API Utilization

APIs are used to bypass the need for direct UI interaction. This approach makes the tests more efficient and reliable, as API calls are faster and less prone to issues than UI operations. By directly sending HTTP requests to the backend, we reduce the complexity and flakiness of tests, ensuring quicker and more stable results. This separation of concerns allows our UI tests to focus solely on verifying user interfaces and workflows.

#### External Services

Integration with external services like **[Mailinator](https://www.mailinator.com/api)** and **proxy servers** is implemented to enhance testing capabilities.
**Mailinator** is used for handling temporary email addresses, allowing to easily manage and verify email-based workflows.
**Proxy servers** are utilized to simulate different network conditions and IP addresses, ensuring our tests cover a wide range of real-world scenarios.

#### CODEOWNERS - Default Pull Request reviewers

This repository uses a CODEOWNERS file to automatically assign reviewers to pull requests based on the files changed.
How It Works:
• The CODEOWNERS file is located in the .github/ directory.
• It maps file paths to specific GitHub users or teams who will be automatically assigned as reviewers.
• This ensures that the appropriate people review changes in their areas of expertise.
For more details, see **[GitHub’s CODEOWNERS documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)**.

### Steps to Write an Automated Test

#### 1. Review Test Case

Each automated test case should correspond to a particular test case which is defined in the TCMS (X-Ray) and follow its action steps. This ensures consistency and alignment between manual test documentation and automated testing efforts. This way the test scenarios are covered by automation and tests are traceable and verifiable.

#### 2. Create Spec File

After reviewing the test case, the next step is to translate it into a test specification by creating a corresponding spec file having _.spec.ts_ extension in _{project_root}/tests_ directory. This involves organizing the test scenarios within a test suite, often represented by a **describe** block, which groups related tests together. Each individual test case is then implemented as a test block within this suite.

```typescript
test.describe("My test suite", () => {});
```

#### 3. Initialize the Test

It's essential to start by adding an empty test. This involves creating the necessary **test** block within the describe block of the test suite. By initializing with an empty test, you ensure that your test structure is set up correctly and that your test runner can execute it without errors.

```typescript
test.describe("My test suite", () => {
	test(`My test`, async () => {});
});
```

#### 4. Implement Preconditions as Fixtures

Preconditions are implemented as fixtures to ensure that each test starts with a consistent and known state. Fixtures are also used to initialize the required Page Objects which will be used to interact with the application under test.
As shown in the example, _homePage_ is a fixture variable which represents Page Object covering the home page.

```typescript
test.describe("My test suite", () => {
	test(`My test`, async ({ homePage }) => {});
});
```

#### 5. Perform Test Actions

Execute the necessary test actions using the Custom POM. They should be implemented if missing or otherwise just called in the test body.
Following the example, the test action performed is to navigate to home page: `await homePage.navigate()`

```typescript
test.describe("My test suite", () => {
	test(`My test`, async ({ homePage }) => {
		await homePage.navigate();
	});
});
```

#### 6. Verify Outcomes with Assertions

It is mandatory to include assertions to verify that the system behaves as expected. Assertions are the checkpoints in tests that confirm whether the actual outcomes match the expected results. By including assertions, the functionality being tested is validated ensuring that any deviations from expected behavior are detected promptly. In the example, the assertion performed is `await homePage.assertThat().titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");`. Its purpose is to check that the home page title is `Gamdom - Top Bitcoin & Crypto Casino!`:

```typescript
test.describe("My test suite", () => {
	test(`My test`, async ({ homePage }) => {
		await homePage.navigate();
		await homePage
			.assertThat()
			.titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");
	});
});
```

#### 7. Combining Actions and Assertions with Steps

In more complex test cases, multiple test actions followed by immediate assertions are often necessary to thoroughly validate the system behavior at each step. To handle this, the framework includes a **steps** component attached to the custom Page Object. This **steps** component combines actions and assertions, allowing for a streamlined approach to writing tests. By encapsulating related actions and their corresponding assertions within a single method, we ensure that each intermediate state is verified before proceeding.
In the example, the called step `await homePage.steps().loginUser("username1", "password1");` performs the needed **actions** for login with user account having username: `username1` and password: `password1` and **asserts** that the login is successful.

```typescript
test.describe("My test suite", () => {
	test(`My test`, async ({ homePage }) => {
		await homePage.navigate();
		await homePage
			.assertThat()
			.titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");
	});
	await homePage.steps().loginUser("username1", "password1");
	await homePage.assertThat().TopBannerDisplayed();
});
```

## Create Pull Request

This project uses a Pull Request (PR) template to ensure consistency and thoroughness when creating new PRs. The template helps standardize the way pull requests are structured, ensuring that important information such as descriptions, issue links, and checklists are included.
When submitting a Pull Request, ensure that you:

-   Fill out the description thoroughly, referencing any issues.
-   Follow the project’s contribution guidelines.
-   Complete the checklist to ensure the code is fully tested and documented.

This helps maintain the quality and consistency of the project, making it easier for reviewers to understand and evaluate your changes.

## Reporting

Reporters in the test automation framework play a crucial role in capturing and presenting test results. They provide detailed insights into test execution, helping into understanding the outcomes and diagnose issues efficiently. The combination of built-in and custom reporters, including HTML, JIRA/X-Ray and Slack reporters gives an opportunity to capture test results in various formats, enhancing the visibility and accessibility of test data. These reporters are dynamically configured based on the **configuration.ts** options.

The configurable reporters are:
**Playwright reporters:**

-   **List Reporter**: Provides a list of tests in the console output
-   **HTML Reporter:** Generates an HTML report

**Custom Reporters:**

-   **[JIRA](https://developer.atlassian.com/cloud/jira/platform/rest/v2/intro/#about)/[XRay](https://docs.getxray.app/display/XRAYCLOUD/REST+API) Reporter:** Integrates with JIRA for reporting test results directly into JIRA/XRay
-   **[Slack Reporter](https://github.com/ryanrosello-og/playwright-slack-report):** Sends summarized test results to a specified Slack channel. Also attaches the generated Playwright HTML report as an archive so that it can be downloaded and reviewed locally.

## Best Practices

### General Practices

-   Have consistency in naming conventions and code structure. Follow the framework directory structure when placing files/modules
-   Add comments and documentation to codebase in cases there is complex logic, specific implementation purpose or noting any tricky or unclear at first glance code.
-   Any additional comments and documentation that can help in clarifying and understanding the code are much encouraged.
-   Sensitive information such as API keys and passwords must be consumed from environment variables. Avoid hardcoding and committing them in the repository.
-   Run the full suite of tests to check for potential regression before committing changes and opening a pull request.
-   Avoid fixed values. Use configuration files or environment variables for values that may change (e.g., URLs, credentials). If such fixed values are required, they must be on a centralized place and reused.
-   Ensure the broader picture of the changes is considered. Review the overall architecture and impact of the modifications and apply necessary changes beyond the conrete scope of a task if applicable.

### Tests Practices

-   Follow the Arrange-Act-Assert (AAA) pattern when writing tests.
-   Use fixtures for test precondition/s to ensure they are consistently applied across all relevant tests
-   Create granular assertions which can be easily combined into more complex ones.
-   Isolate tests so that they are independent and can be run in any order. Having such dependencies will cause chained test failures.
-   Adhere to Custom Page Object Model and its components. Each test (if there is no strong valid reason to do the opposite) should be constructed by mostly page object method calls.
-   Investigate and use APIs to shorten UI interactions for tests that need to bypass certain steps or scenarios thus improving test execution speed and reducing flakiness.

### Reporting Practices

-   Monitor for any potential failures with reporting in the CI/CD environment, where it is configured to be enabled exclusively. Prioritize these issues as high priority.
-   Use [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro) when debugging tests and lower-level details are needed.

### CI/CD Practices

-   Investigate nightly run build failures and address them at the earliest opportunity.
-   Pay attention to environment-under-test healthiness. Sometimes most of the failures could be due to unstable/unhealthy environment (connectivity, unstable build, deployment issues etc)
-   Supply environment variables to manage sensitive or periodically updated data.

### Maintenance Practices

-   Keep dependencies in the test framework regularly updated to benefit new features and bugfixes.
-   Refactor the codebase to improve structure, remove duplications and incorporate better practices.
-   Monitor test flakiness and troubleshoot the underlying causes.
