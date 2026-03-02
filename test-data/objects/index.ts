import { BetTestDataObjectFactory } from "./factories/bet-test-data-object-factory";
import { BlogPostTestDataObjectFactory } from "./factories/blog-post-test-data-object-factory";
import { DiceBetTestDataObjectFactory } from "./factories/dice-bet-test-data-object-factory";
import { FreeSpinsPromotionTestDataObjectFactory } from "./factories/free-spins-promotion-test-data-object-factory";
import { HiloBetTestDataObjectFactory } from "./factories/hilo-bet-test-data-object-factory";
import { PromotionTestDataObjectFactory } from "./factories/promotion-test-data-object-factory";
import { RouletteBetTestDataObjectFactory } from "./factories/roulette-bet-test-data-object-factory";
import { RegisterTestDataObjectFactory } from "./factories/register-test-data-object-factory";
import { RoyaltyUpLevelRanksTestDataObjectFactory } from "./factories/royalty-up-level-ranks-test-data-object-factory";
import { SportsBlogArticleTestDataObjectFactory } from "./factories/sports-blog-article-test-data-object-factory";

export const objectFactoryRegistry = {
	bet: BetTestDataObjectFactory,
	diceBet: DiceBetTestDataObjectFactory,
	hiloBet: HiloBetTestDataObjectFactory,
	rouletteBet: RouletteBetTestDataObjectFactory,
	register: RegisterTestDataObjectFactory,
	freeSpinsPromotion: FreeSpinsPromotionTestDataObjectFactory,
	blogArticle: SportsBlogArticleTestDataObjectFactory,
	blogPost: BlogPostTestDataObjectFactory,
	promotions: PromotionTestDataObjectFactory,
	royaltyUpLevelRanks: RoyaltyUpLevelRanksTestDataObjectFactory,
};
