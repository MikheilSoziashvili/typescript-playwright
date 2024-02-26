import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class HiloGamePageMap extends BaseMap {
    public constructor(page: Page) {
        super(page);
    }

    private get siteContent(): Locator {
        return this.page.locator("#site_content")
    }

    private get gameContainer(): Locator {
        return this.siteContent.locator("div[class^='gui-styled__Container-']")
    }

    public get usersInfoArea(): Locator {
        return this.gameContainer.locator("div[class^='gui-styled__LeftColumn-']")
    }

    public get gameArea(): Locator {
        return this.gameContainer.locator("div[class^='gui-styled__CenterColumn-']")
    }

    public get betControlsArea(): Locator {
        return this.gameContainer.locator("div[class^='gui-styled__RightColumn-']")
    }

    public get statsArea(): Locator {
        return this.gameContainer.locator("div[class^='gui-styled__BottomColumn-']")

    }

    // game area
    public get gameStatusLocator(): Locator {
        return this.gameArea.locator("div[class*='Status-']")
    }

    public get gamRoundResultLocator(): Locator {
        return this.gameArea.locator("div[class*='GameStateUi-styled__RoundResultNumber']")
    }

    public get yourBetContainer(): Locator {
        return this.gameArea.locator("div[class*='BetButtonAmount-styled__BetsContainer-']")
    }

    public get yourBetField(): Locator {
        return this.yourBetContainer.locator("input[class*='MuiInputBase-inputAdornedStart'] ")
    }

    //bet controls
    private get betButtonsContainer(): Locator {
        return this.betControlsArea.locator("div[class*='gui-styled__BetButtonsContainer']")
    }

    private get otherButtonsContainer(): Locator {
        return this.betButtonsContainer.locator("div[class*='gui-styled__OtherButtonsWrapper-']")
    }

    private get colorButtonsContainer(): Locator {
        return this.otherButtonsContainer.locator("div[class*='gui-styled__ColorButtonsContainer-']")
    }

    public get redButton(): Locator {
        return this.colorButtonsContainer.locator("button:has-text('Red')")
    }

    public get blackButton(): Locator {
        return this.colorButtonsContainer.locator("button:has-text('Black')")
    }
}