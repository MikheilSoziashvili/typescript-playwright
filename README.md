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

## Overview

Playwright-based test automation framework developed with Node.js and Typescript, designed for automated end-to-end testing of Gamdom web application.
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
|--- .github
|    |--- workflows                                       # GitHub Actions pipelines
|--- api                                                  # REST API Clients
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

The configuration settings for the automation framework are located in the **configuration.ts** file. This file exports constant variables that define various configuration options used throughout the project. These configuration variables can be imported in test files and other parts of the project. Some of the values are taken from environment variables, which are managed using the _dotenv_ package.

### Environment Variables

For local development create a _.env_ file in the root of your project and add environment-specific variables.
For CI/CD ensure environment variables are injected into pipeline.

### Playwright Configuration File

In addition to the **configuration.ts** file, the framework also utilizes a **playwright.config.ts** Playwright configuration file to define global configuration settings for Playwright and the tests. It reads some of the values directly from **configuration.ts** module and applies them accordingly.
Also there is additional Playwright reporting configuration which depends on **configuration.ts** value and reflected into **playwright.config.ts**.

## Running Tests

-   **All tests**
    To run all tests, use:
    `yarn playwright test`

-   **Specific tests**
    `yarn playwright test path/to/testfile.spec.ts`

-   **By tag**
    `yarn playwright test --grep @myTag`

## Writing Tests

The tests should be designed to efficiently and consistently validate the functionality of the application under test by mimicking user interactions and checking for expected outcomes.

### Main Test Components

The main approach used during writing tests is the Arrange-Act-Assert Pattern.
Combining custom modules and patterns along with the capabilities of Playwright allows for the creation of highly modular, scalable, and maintainable test that can handle complex testing scenarios efficiently.

#### Playwright Fixtures

Playwright fixtures are used to set up the necessary preconditions, state and page objects for each test. Fixtures are reusable components that can initialize data, manage test dependencies, provide access to UI interaction methods, cleanup actions.

#### Custom Page Object Model

The Page Object Model (POM) is a design pattern in test automation that enhances the maintainability and readability of test scripts. In POM, each web page (or significant page component) is represented by a corresponding class, which encapsulates the page’s elements and interactions. This abstraction layer allows tests to interact with the page objects rather than directly with the page elements, promoting code reuse and reducing duplication.

**Custom Page Object Model** is utilized to represent and interact with the various pages and components of the application under test. Each Page Object class **consists of three classes** which respectively encapsulate **the page elements, interactions and assertions** of a specific page or component, providing a clear and maintainable abstraction layer for test scripts.
There is an additional **steps** component added to the model, which serves as collection of multiple consecutive actions and assertions performed on the page. This helps for better test readability, maintenance and organization of actions and assertions.

#### API Utilization

APIs are used to bypass the need for direct UI interaction. This approach makes the tests more efficient and reliable, as API calls are faster and less prone to issues than UI operations. By directly sending HTTP requests to the backend, we reduce the complexity and flakiness of tests, ensuring quicker and more stable results. This separation of concerns allows our UI tests to focus solely on verifying user interfaces and workflows.

#### External Services

Integration with external services like **Mailinator** and **proxy servers** is implemented to enhance testing capabilities.
**Mailinator** is used for handling temporary email addresses, allowing to easily manage and verify email-based workflows.
**Proxy servers** are utilized to simulate different network conditions and IP addresses, ensuring our tests cover a wide range of real-world scenarios.

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

## Reporting

Reporters in the test automation framework play a crucial role in capturing and presenting test results. They provide detailed insights into test execution, helping into understanding the outcomes and diagnose issues efficiently. The combination of built-in and custom reporters, including HTML, JIRA/X-Ray and Slack reporters gives an opportunity to capture test results in various formats, enhancing the visibility and accessibility of test data. These reporters are dynamically configured based on the **configuration.ts** options.

The configurable reporters are:
**Playwright reporters:**

-   **List Reporter**: Provides a list of tests in the console output
-   **HTML Reporter:** Generates an HTML report

**Custom Reporters:**

-   **JIRA/XRay Reporter:** Integrates with JIRA for reporting test results directly into JIRA/XRay
-   **Slack Reporter:** Sends summarized test results to a specified Slack channel. Also attaches the generated Playwright HTML report as an archive so that it can be downloaded and reviewed locally.
