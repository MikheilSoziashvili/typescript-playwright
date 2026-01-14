import { BaseMap } from "@base/base-map";
import { EsportsSidebarSection } from "@enums/esports-sidebar-sections";
import { FrameLocator, Locator, Page } from "@playwright/test";

export class EsportsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sportsIFrame(): FrameLocator {
		return this.page.frameLocator(`iframe[id*='obt-sportsbook']`);
	}

	public get sidebarContainer(): Locator {
		return this.sportsIFrame.locator(".sidebar-columna");
	}

	public sidebarSectionHeader(sectionName: EsportsSidebarSection): Locator {
		return this.sidebarContainer.locator(".v-expansion-panel-header", {
			hasText: sectionName,
		});
	}

	public sidebarSectionContent(sectionName: EsportsSidebarSection): Locator {
		return this.sidebarSectionHeader(sectionName)
			.locator("..")
			.locator(".v-expansion-panel-content");
	}

	public sidebarSectionItem(
		sectionName: EsportsSidebarSection,
		itemName: string,
	): Locator {
		return this.sidebarSectionContent(sectionName)
			.locator(".contenido")
			.locator(".item", {
				hasText: itemName,
			})
			.first();
	}

	public get esportsButton(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "E-Sports",
		});
	}

	public get featuredMatchesTitle(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "Featured Matches",
		});
	}

	public get liveMatchesTitle(): Locator {
		return this.sportsIFrame.locator("span.text-truncate", {
			hasText: "Live matches",
		});
	}
}
