import { TestInfo } from "@playwright/test";
import { IAttributeBuilder } from "../builders/attribute-builder.interface";
import { CompositeAttributeBuilder } from "../builders/composite-attribute-builder";
import { TagAttributeBuilder } from "../builders/tag-attribute-builder";
import { AuthorAttributeBuilder } from "../builders/author-attribute-builder";
import { ArbitraryAnnotationAttributeBuilder } from "../builders/arbitrary-annotation-builder";
import { DefectAttributeBuilder } from "../builders/defect-attribute-builder";
import { ReportPortalService } from "../services/reportportal-service";
import { ConfigExtractor } from "../extractors/config-extractor";
import { JiraIssueExtractor } from "../extractors/jira-issue-extractor";
import { ReportPortalConfig } from "../types/reportportal-types";

/**
 * Orchestrates the setup of ReportPortal for a test
 */
export class ReportPortalSetupHandler {
	private readonly attributeBuilder: IAttributeBuilder;
	private readonly reportPortalService: ReportPortalService;

	constructor(
		attributeBuilder?: IAttributeBuilder,
		reportPortalService?: ReportPortalService,
	) {
		this.attributeBuilder =
			attributeBuilder ??
			new CompositeAttributeBuilder([
				new TagAttributeBuilder(),
				new AuthorAttributeBuilder(),
				new ArbitraryAnnotationAttributeBuilder(),
				new DefectAttributeBuilder(),
			]);
		this.reportPortalService =
			reportPortalService ?? new ReportPortalService();
	}

	/**
	 * Sets up ReportPortal for the given test
	 */
	setup(testInfo: TestInfo): void {
		const result = ConfigExtractor.extract(testInfo);

		if (!result.success) {
			return;
		}

		this.setupAttributes(result.config);
		this.setupTestCaseId(result.config, testInfo);
	}

	private setupAttributes(config: ReportPortalConfig): void {
		const attributes = this.attributeBuilder.build(config);
		this.reportPortalService.addAttributes(attributes);
	}

	private setupTestCaseId(
		config: ReportPortalConfig,
		testInfo: TestInfo,
	): void {
		const jiraIssueId = this.resolveJiraIssueId(config, testInfo);

		if (jiraIssueId) {
			this.reportPortalService.setTestCaseId(jiraIssueId);
		}
	}

	private resolveJiraIssueId(
		config: ReportPortalConfig,
		testInfo: TestInfo,
	): string | undefined {
		return config.jiraIssueId ?? JiraIssueExtractor.extract(testInfo.title);
	}
}
